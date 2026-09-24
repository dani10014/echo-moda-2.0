import { PrismaClient } from '@prisma/client';
import { MercadoPagoConfig, Payment } from "mercadopago";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import { Resend } from 'resend';
import rateLimit from 'express-rate-limit';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const prisma = new PrismaClient();
const app = express();
const allowedOrigins = [
    process.env.URL_DEV,
    process.env.URL_PRODUCTION
];
const resend = new Resend(process.env.RESEND_API_KEY);
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure:isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
};

const TEMP_COOKIE_OPTIONS = {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60 * 1000,
};

const MENSAGENS_ERRO = {
    dadosInvalidos: "Dados inválidos.",
    tokenAusente: "Token não fornecido.",
    tokenInvalido: "Token inválido ou expirado.",
    acessoNegado: "Acesso negado.",
    erroInterno: "Erro interno no servidor.",
};

function responderErro(res, status, erro, detalhes = {}) {
    return res.status(status).json({
        sucesso: false,
        erro,
        ...detalhes,
    });
}

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

const limitadorAuth = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: { sucesso: false, erro: "Muitas tentativas a partir deste IP. Tente novamente mais tarde." },
    standardHeaders: true,
    legacyHeaders: false,
});

const limitadorGeral = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 150,
    message: { sucesso: false, erro: "Muitas tentativas a partir deste IP. Tente novamente mais tarde." },
    standardHeaders: true,
    legacyHeaders: false,
})

app.set('trust proxy', 1);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado pelo CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));

const clientMercadoPago = new MercadoPagoConfig({
    accessToken: process.env.ACCESS_TOKEN,
    options: { timeout: 5000 }
});

const payment = new Payment(clientMercadoPago);

BigInt.prototype.toJSON = function() {
    return this.toString();
};

console.log(prisma);

function validarDadosUsuario(dados) {
    const erros = [];

    if (!dados.email || !dados.email.includes("@")) {
        erros.push("Email inválido");
    }

    if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push("Nome deve ter no mínimo 3 caracteres");
    }

    if (!dados.cpf || !/^\d{11}$/.test(dados.cpf.replace(/\D/g, ""))) {
        erros.push("CPF inválido (deve ter 11 dígitos)");
    }

    if (typeof dados.precoTotal !== "number" || dados.precoTotal <= 0) {
        erros.push("Preço total inválido");
    }

    return erros;
}

function sanitizarCPF(cpf) {
    return cpf.replace(/\D/g, "");
}

const SECRET_KEY = process.env.JWT_SECRET;

function gerarToken(usuario,tipo){
    if (!SECRET_KEY) {
        throw new Error('JWT_SECRET não configurado no ambiente');
    }

    const payload = {
        id: usuario.id,
        email: usuario.email,
        tipo:tipo
    };
    
    if(tipo === "temp_resetPassword"){
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
    }
    if(tipo === "temp_login"){
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '15m' });
    }
    if(tipo === "authLogin"){
        return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
    }else{
        throw new Error("Erro ao gerar token");
    }
}

function extrairTokenDeCookie(cookieHeader, nomesPermitidos) {
    if (!cookieHeader) return null;

    const nomes = nomesPermitidos || ['authLogin', 'AuthToken', 'authToken'];

    for (const cookie of cookieHeader.split(';')) {
        const separador = cookie.indexOf('=');
        if (separador === -1) continue;

        const nome = cookie.slice(0, separador).trim();
        if (!nomes.includes(nome)) continue;

        const valor = cookie.slice(separador + 1).trim();
        if (!valor) continue;

        try {
            return decodeURIComponent(valor);
        } catch {
            return null;
        }
    }

    return null;
}

function verificarToken(tipoToken = 'authLogin'){
    return (req,res,next,) =>{
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        const cookiesPorTipo = {
            authLogin: ['authLogin', 'AuthToken', 'authToken'],
            temp_login: ['loginVerification'],
            temp_resetPassword: ['temp_resetPassword'],
        };
        token = extrairTokenDeCookie(req.headers.cookie || '', cookiesPorTipo[tipoToken]);
    }

    if (!token) {
        return responderErro(res, 401, MENSAGENS_ERRO.tokenAusente);
    }

    jwt.verify(token, SECRET_KEY, (err, usuarioDecodificado) => {
        if (err) {
            return responderErro(res, 403, MENSAGENS_ERRO.tokenInvalido);
        }
        
        if(usuarioDecodificado.tipo !== tipoToken){
            return responderErro(res, 403, MENSAGENS_ERRO.acessoNegado);
        }

        req.usuario = usuarioDecodificado; 
        next();
    });
}
}
const saltRounds = 10; 


async function criarHash(senhaPura) {
    return await bcrypt.hash(senhaPura, saltRounds);
}

async function compararSenha(senhaPura, senhaComHash) {
    if(!senhaPura || !senhaComHash){
        return false;
    }

    return await bcrypt.compare(senhaPura, senhaComHash);
}

app.post('/api/verificar-google',limitadorAuth, async (req, res) => {
    try {
        const {token} = req.body;
        
        if (!token) {
            return responderErro(res, 400, "Token é obrigatório.");
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID,
        });
        
        const payload = ticket.getPayload();

        const email = payload['email'];
        const name = payload['name'];
        const _picture = payload['picture'];
        
        const criarUser = await prisma.usuarios.upsert({
            where:{email:email},
            update:{
                nome:name,
            },
            create:{
                email:email,
                nome:name
            }
        });

        const tokenUsuario = gerarToken(criarUser,"authLogin");

        res.cookie("authLogin", tokenUsuario, COOKIE_OPTIONS);
        
        return res.status(200).json({Mensagem:"Usuario criado com sucesso"})

    }catch (error) {
        return responderErro(res, 401, "Token do Google inválido.");
    }
});
app.post("/api/calcular-produtos",limitadorGeral, async (req,res) =>{
    try{
        const {itens} = req.body;

        if(!itens){
            return responderErro(res, 400, MENSAGENS_ERRO.dadosInvalidos);
        }

        const id = itens.map((item => Number(item.id)));
        
        const resultado = await prisma.produtos.findMany({
            where:{
                id:{in:id}
            }
        })

        let valorTotal = 0;

        for(let item of itens){
            const produtoBanco = resultado.find(produto => Number(produto.id) === Number(item.id));

            if(!produtoBanco){
                return responderErro(res, 400, "Produto inexistente no banco de dados.");
            }

            valorTotal += produtoBanco.preco * item.quantidade;

        }
            return res.status(200).json({sucesso:true,total:valorTotal})

        }catch(erro){
            console.error("Erro ao buscar produtos para pagamento:", erro);
            return res.status(500).json({ sucesso: false, erro: "Erro ao buscar produtos para pagamento" });
        }
    });
app.post("/api/criar-pagamento",limitadorGeral,verificarToken(), async (req, res) => {
    try {
        const { email, nome, cpf, precoTotal} = req.body;
        const idUser = req.usuario.id;

        const erros = validarDadosUsuario({ email, nome, cpf, precoTotal });

        if (erros.length > 0) {
            return responderErro(res, 400, "Dados do pagamento inválidos.", { erros });
        }

        const cpfSanitizado = sanitizarCPF(cpf);
        const nomePartes = nome.trim().split(" ");
        const firstName = nomePartes[0];
        const lastName = nomePartes.slice(1).join(" ") || "Silva";

        const body = {
            transaction_amount: Number(precoTotal),
            description: "Compra na loja EchoModa",
            payment_method_id: "pix",
            payer: {
                email: email.trim(),
                first_name: firstName,
                last_name: lastName,
                identification: {
                    type: "CPF",
                    number: cpfSanitizado
                }
            }
        };

        const requestOptions = {
            idempotencyKey: crypto.randomUUID() 
        };

        const resultado = await payment.create({ body, requestOptions });

        const transactionData = resultado.point_of_interaction?.transaction_data;
        
        if(resultado && resultado.id){

            const pedidoSalvo = await prisma.pedidos.create({
                data: {
                    id:crypto.randomUUID(),
                    usuario_id:idUser,
                    mp_id:resultado.id.toString(),
                    total: Number(precoTotal),
                    status: "Pendente",
                    data_pedido:new Date(),
                }
            });

            console.log("Pedido salvo com ID:", pedidoSalvo.id);
        } else {
            throw new Error("Falha ao obter ID do pagamento do Mercado Pago.");
        }

        if (!transactionData) {
            throw new Error("Dados de interação do PIX não retornados pelo Mercado Pago.");
        }

        return res.json({
            sucesso: true,
            idPagamento: resultado.id,
            copiaECola: transactionData.qr_code,
            qrCodeLink: transactionData.qr_code_base64
        });

    } catch (erro) {
        console.error("Erro detalhado do Mercado Pago:", erro.response?.data || erro.message);
        
        const mensagemErro ="Erro ao processar pagamento";
        return res.status(500).json({ sucesso: false, erro: mensagemErro });
    }
});
app.post("/api/verificar-cadastro" ,limitadorAuth, async (req,res) => {
    try{
        const {email} = req.body;

        if(!email){
            return res.status(400).json({ erro: "Dados incompletos" });
        }
        
        const usuario = await prisma.usuarios.findUnique({
            where: {
                email:email.trim()
            }
        })

        if(usuario){
            return res.status(200).json({mensagem:"usuario existe no banco"})
            
        }else{
            return responderErro(res, 400, "Usuário não encontrado.");
        }

    }catch(erro){
        console.error("Erro:", erro);
        return res.status(500).json({ erro: "Erro ao conectar no servidor" });
    }
})
app.post("/api/logar",limitadorAuth,async (req,res) => {
    try{
        const {email,senha} = req.body

        if(!email || !senha){
            return responderErro(res, 400, MENSAGENS_ERRO.dadosInvalidos);
        }

        if(senha.trim().length < 8){
            return responderErro(res, 400, "A senha deve ter no mínimo 8 caracteres.");
        }

        const resultado = await prisma.usuarios.findUnique({
            where:{
                email:email.trim(),
            }
        });
        
        if(!resultado){
            return responderErro(res, 400, "E-mail ou senha inválidos.");
        }

        if (!resultado.senha) {
            return responderErro(res, 400, "Esta conta foi criada via Google. Defina uma senha por e-mail.", {
                precisaCadastrarSenha: true,
            });
        }

        const senhaValida = resultado ? await compararSenha(senha, resultado.senha) : false;
        
        if (!senhaValida) {
            return responderErro(res, 400, "E-mail ou senha inválidos.");
        }

        if(resultado && senhaValida){
            const { senha: _, ...usuarioSemSenha } = resultado;
            try {
                const tokenTemporario = gerarToken(usuarioSemSenha,"temp_login");
                res.cookie("loginVerification", tokenTemporario, TEMP_COOKIE_OPTIONS);
                return res.status(200).json({ sucesso: true, usuario: usuarioSemSenha});
            } catch (tokenError) {
                return responderErro(res, 500, "Não foi possível iniciar a verificação.");
            }
        }

    }catch(erro){
        console.error("Erro no login:", erro);
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
})
    /** Essa rota gera o token definitivo caso o user verique o email e possua o token temp */


app.post("/api/authlogin",limitadorAuth,verificarToken('temp_login'),async (req,res) =>{
    try{
        
        const usuario = req.usuario;

        const token = gerarToken(usuario,"authLogin")

        res.clearCookie("loginVerification", TEMP_COOKIE_OPTIONS);
        return res.cookie("authLogin",token,COOKIE_OPTIONS).status(200).json({ sucesso: true });

    }catch(erro){
        console.error("Erro ao gerar token de autenticação:", erro);
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
})

function gerarCodigoVerificacao() {
    return crypto.randomInt(100000, 999999).toString();
}
const codigosTemporarios = new Map();

async function enviarEmailVerificacao(destinatario, codigo) {
    return await resend.emails.send({
        from: 'onboarding@resend.dev', 
        to: destinatario,
        subject: 'Seu código de verificação EchoModa',
        html: `<p>Olá! Seu código de verificação é: <strong>${codigo}</strong>. Ele expira em 5 minutos.</p>`
    });
}

app.post("/api/enviar-codigo", limitadorAuth, async (req, res) => {
    try {
        const { email } = req.body;
        if (typeof email !== "string" || !email.trim()) {
            return responderErro(res, 400, "E-mail é obrigatório.");
        }

        const emailNormalizado = email.trim().toLowerCase();

        const codigo = gerarCodigoVerificacao();

        const expiraEm = Date.now() + (5 * 60 * 1000);

        codigosTemporarios.set(emailNormalizado, { codigo, expiraEm });
        
        await enviarEmailVerificacao(emailNormalizado, codigo);
        
        return res.status(200).json({ mensagem: "Código enviado!" });
    } catch (erro) {
        console.error("ERRO DETALHADO NO SMTP:", erro);
        return responderErro(res, 500, "Não foi possível enviar o código.");
    }
});

app.post("/api/verificar-codigo",limitadorAuth,async (req, res) => {
    const email = req.body.email?.trim().toLowerCase();
    const codigo = String(req.body.codigo || "");
    const fluxo = req.body.fluxo;

    if(!email || !/^\d{6}$/.test(codigo) || !["login", "reset"].includes(fluxo)){
        return responderErro(res, 400, "Código inválido.");
    }

    const registro = codigosTemporarios.get(email);
    if (!registro || Date.now() > registro.expiraEm || registro.codigo !== codigo) {
        if (registro && Date.now() > registro.expiraEm) codigosTemporarios.delete(email);
        return responderErro(res, 400, "Código inválido ou expirado.");
    }

    try {
        const usuario = await prisma.usuarios.findUnique({ where: { email } });
        if (!usuario) return responderErro(res, 400, "Código inválido.");

        if (fluxo === "login") {
            const tokenLogin = extrairTokenDeCookie(req.headers.cookie || "", ["loginVerification"]);
            const dadosLogin = tokenLogin && jwt.verify(tokenLogin, SECRET_KEY);
            if (!dadosLogin || dadosLogin.tipo !== "temp_login" || dadosLogin.email !== email) {
                return responderErro(res, 401, "A sessão de login expirou.");
            }
            const tokenDefinitivo = gerarToken(usuario, "authLogin");
            res.clearCookie("loginVerification", TEMP_COOKIE_OPTIONS);
            res.cookie("authLogin", tokenDefinitivo, COOKIE_OPTIONS);
        } else {
            const tokenReset = gerarToken(usuario, "temp_resetPassword");
            res.cookie("temp_resetPassword", tokenReset, TEMP_COOKIE_OPTIONS);
        }

        codigosTemporarios.delete(email);
        return res.status(200).json({ mensagem: "Código verificado com sucesso", fluxo });
    } catch (erro) {
        return responderErro(res, 401, "A sessão de verificação é inválida ou expirou.");
    }
});

app.post("/api/verificar-codigo-resetPassWord",limitadorAuth,async (req, res) => {
    const { email, codigo } = req.body;
    
    if(!email || !codigo){
        return responderErro(res, 400, "E-mail e código são obrigatórios.");
    }

    const registro = codigosTemporarios.get(email);

    if (!registro) {
        return responderErro(res, 400, "Solicite um novo código.");
    }

    if (Date.now() > registro.expiraEm) {
        codigosTemporarios.delete(email);
        return responderErro(res, 400, "O código expirou.");
    }

    if(codigo !== registro.codigo){
        return responderErro(res, 400, "Código inválido.");
    }

    try{
        const usuario = await prisma.usuarios.findUnique({
            where:{
                email:email
            }
        })

        if(usuario){

            const token = gerarToken(usuario,"temp_resetPassword");

            codigosTemporarios.delete(email);

            res.cookie('temp_resetPassword', token,TEMP_COOKIE_OPTIONS)

            return res.status(200).json({ mensagem: "Código verificado com sucesso!" });

        }else{
            return responderErro(res, 400, "Não foi possível validar o código.");
        }
    }catch(erro){
        console.error("Erro em:",erro)
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
});

app.post("/api/nova-senha", limitadorAuth, verificarToken("temp_resetPassword"), async (req, res) => {
    const senha = req.body.senha;

    if (typeof senha !== "string" || senha.length < 8 || senha.length > 128) {
        return responderErro(res, 400, "A senha deve ter entre 8 e 128 caracteres.");
    }

    try {
        await prisma.usuarios.update({
            where: { id: req.usuario.id },
            data: { senha: await criarHash(senha) }
        });

        res.clearCookie("temp_resetPassword", TEMP_COOKIE_OPTIONS);
        return res.status(200).json({ mensagem: "Senha alterada com sucesso" });
    } catch (erro) {
        console.error("Erro ao alterar senha:", erro);
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
});

app.post("/api/criar-cadastro",limitadorAuth,async (req,res) =>{
    try{
        const {nome,email,senha} = req.body

        if (!nome || typeof nome !== 'string' || nome.trim().length < 3 || nome.trim().length > 32 ){
            return responderErro(res, 400, "O nome deve ter entre 3 e 32 caracteres.");
        }
        
        if (/\d/.test(nome)) {
            return responderErro(res, 400, "O nome não pode conter números.");
        }
        
        if(nome.trim().length > 32){
            return responderErro(res, 400, "O nome deve ter no máximo 32 caracteres.");
        }

        if(senha.length < 8 ){
            return responderErro(res, 400, "A senha deve ter no mínimo 8 caracteres.");
        }
            const novoUsuario = await prisma.usuarios.create({
            data:{
                nome:nome,
                email:email,
                senha: await criarHash(senha)
            }
        })
            const {senha: _senha,...usuarioSemSenha} = novoUsuario
            try {
                const token = gerarToken(usuarioSemSenha,"authLogin");
                res.cookie('authLogin', token, COOKIE_OPTIONS);
                return res.status(201).json({ sucesso: true, mensagem: "Sucesso,usuario criado com sucesso",});
            } catch (tokenError) {
                console.error('Erro ao gerar token no cadastro:', tokenError);
                return responderErro(res, 500, "Não foi possível criar a sessão.");
            }

    }catch(erro){
        console.error(erro)
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
})
app.get("/api/buscar-produtos",limitadorGeral, async (req, res) => {
    try{
        const resultado = await prisma.produtos.findMany();

        return res.status(200).json(resultado);
    }
    catch(erro){
        console.error("ERRO EXATO NO FINDMANY:", erro);
        return responderErro(res, 500, "Não foi possível buscar os produtos.");
    }
})
app.post("/api/salvar-favoritos",limitadorGeral,verificarToken(),async (req, res) => {
    try {
        const { idproduto } = req.body;
        const idclient = req.usuario.id;

        if (!idclient || idproduto == null) {
            return responderErro(res, 400, "Dados de favorito inválidos.");
        }

        if (!prisma.favoritos) {
            return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
        }

        const resultado = await prisma.favoritos.create({
            data: {
                id_client: String(idclient),
                id_produto: BigInt(idproduto)
            }
        });

        return res.status(200).json({ resultado: "Sucesso", dados: resultado });

    } catch (erro) {
        console.error("Erro ao salvar favorito:", erro);
        return responderErro(res, 500, "Não foi possível salvar o favorito.");
    }
});
app.delete("/api/remover-favoritos",limitadorGeral,verificarToken(), async (req,res) =>{
    try{
        const {idproduto} = req.body
        const idclient = req.usuario.id;
        
        if(!idclient || !idproduto){
            return responderErro(res, 400, "Dados do favorito inválidos.");
        }
        const resultado = await prisma.favoritos.delete({
            where:{
                id_client_id_produto:{
                    id_client:String(idclient),
                    id_produto:BigInt(idproduto),
                }
            }
        })
        return res.status(200).json({mensagem:"Sucesso ao remover produto",produto:resultado})
        
    }catch(erro){
        console.error(erro)
        return responderErro(res, 500, "Não foi possível remover o favorito.");
    }
})
app.get("/api/buscar-favoritos",limitadorGeral,verificarToken(), async (req,res) =>{
    try{
        const idclient = req.usuario.id;
        
        if(!idclient){
            return responderErro(res, 400, "Usuário não identificado.");
        }
        const resultado = await prisma.favoritos.findMany({
            where:{
                id_client:String(idclient),
            }
        })

        return res.status(200).json(resultado)

    }catch(erro){
        console.error("Erro no servidor",erro)
        return responderErro(res, 500, MENSAGENS_ERRO.erroInterno);
    }
})
app.put("/api/alterar-dados-usuario",limitadorGeral ,verificarToken(), async (req,res) =>{
    try{
        const{nomeNovo,novoEmail,novoNumero} = req.body
        const idUser = req.usuario.id;

        if(!idUser || !nomeNovo){
            return res.status(400).json("Nenhum id e nenhum nome recebido");
        }
        
        if(!novoNumero || typeof(novoNumero) !== "string" || novoNumero.trim().replace(/\D/g, "").length !== 13){
            return res.status(400).json("Numero invalido");
        }

        if(!novoEmail || typeof(novoEmail) !== "string"){
            return res.status(400).json("Email com tipo invalido ");
        }

        if(nomeNovo.length > 32 || nomeNovo.length < 3){
            return res.status(400).json("O nome deve ter entre 3 e 32 caracteres.");
        }

        if(/\d/.test(nomeNovo)){
            return res.status(400).json({erro:"Nome não pode conter numeros"})
        }


        const resposta = await prisma.usuarios.update({
            where:{id:idUser},
            data:{
                nome:nomeNovo,
                email:novoEmail,
                numero:novoNumero,
            }
        })

        const {senha,id,...respostaSemSenha} = resposta
        return res.status(200).json({Mensagem:"Nome atualizado",Resultado:respostaSemSenha})

    }catch(erro){
        console.error(erro.message)
        return res.status(500).json("Erro no servidor")
    }
})
app.post("/api/alterar-endereco" ,limitadorAuth ,verificarToken(), async (req,res) =>{
    try{
        let{cep,numero,rua,bairro,cidade,estado,complemento} = req.body;
        const idUser = req.usuario.id;

        if (!idUser) {
            return res.status(400).json({ erro: "ID do usuário é obrigatório." });
        }

        if (!cep || !numero || !rua || !bairro || !cidade || !estado) {
            return res.status(400).json({ erro: "Preencha todos os campos obrigatórios do endereço." });
        }

        if (!complemento || complemento.trim() === "") {
            complemento = "Não informado";
        }
        
        const respostaAtualizacao = await prisma.endereco.upsert({
            where: { id: idUser },
            update: {
                cep: cep,
                numero: numero,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                estado: estado,
                complemento: complemento
            },
            create: {
                id: idUser,
                cep: cep,
                numero: numero,
                rua: rua,
                bairro: bairro,
                cidade: cidade,
                estado: estado,
                complemento: complemento
            }
        })

        return res.status(200).json({ sucesso: true, mensagem: "Endereço atualizado com sucesso", endereco: respostaAtualizacao });
        

    }catch(erro){
        console.error("Erro ao atualizar endereço:", erro);
        return res.status(500).json({ sucesso: false, erro: "Erro ao atualizar endereço" });
    }
})
app.get("/api/buscar-endereco", limitadorGeral, verificarToken(), async (req, res) => {
    try{
        const idUser = req.usuario.id;

        if(!idUser){
            return res.status(400).json({erro:"Id do usuario não recebido"})
        }

        const resultadoBuscaEndereco = await prisma.endereco.findUnique({
            where:{
                id:idUser
            }
        });

        return res.status(200).json({sucesso:true,endereco:resultadoBuscaEndereco})

    }catch(erro){
        console.error("Erro no servidor",erro);
        return res.status(500).json({sucesso:false,erro:"Erro no servidor"})
    }
})
app.get("/api/buscar-historico" ,limitadorGeral ,verificarToken(), async (req,res) =>{
    try{
        const iduser = req.usuario.id

        if(!iduser){
            return res.status(400).json({erro:"Id do usuario não recebido"})
        }

        const resultadoBuscaHistorico = await prisma.pedidos.findMany({
            where:{
                usuario_id:iduser
            }
        })
            return res.status(200).json({Resposta:resultadoBuscaHistorico || []});
    }catch(erro){
        console.error("Erro ao buscar histórico:", erro);
        return res.status(500).json({ erro: "Erro interno no servidor ao buscar histórico" });
    }
})
app.get("/api/validar-sessao", verificarToken(), (req, res) => {
    return res.status(200).json({ sucesso: true, usuario: req.usuario });
});
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use((req, res) => {
    res.status(404).json({ erro: "Rota não encontrada" });
});

app.listen( PORT, ()=> {
    console.log(`CORS permitido para: ${allowedOrigins.join(", ")}`);
});
