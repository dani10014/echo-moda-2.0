<template>
    <main class="main-login">
        <header>
            <cabecalho
                textoBtn="Voltar"
                @acao="irParaHome"
                :menuDropAtivo="false"
            />
        </header>
        <div class="bg-login">
            <img src="../assets/images/hero-background.png">
        </div>
        <div class="container-card-login">
            <div class="card">
                <LoginTelaInicial v-if="loginInicialAtivo" @irParaTelaEsqueciSenha="mudarTelaParaEsqueciSenha" @telaVerificarCodigo="irParaTelaVerificacaoCodigo" @irParaTelaDeCadastro="irParaTelaDeCadastro"/>
                <TelaEsqueciSenha v-if="telaEsqueciSenhaAtiva" @voltarAoLoginInicial="voltarTelaLoginInicial" @irParaVerificacao="irParaTelaVerificacaoCodigo"/>
                <TelaVerificarCodigo v-if="verificarCodigoAtivo" :fluxo="fluxoVerificacao" @codigoVerificado="aoVerificarCodigo"/>
                <TelaNovaSenha v-if="novaSenhaAtiva" @senhaAlterada="voltarTelaLoginInicial"/>
                <telaCriarConta v-if="telaCriarContaAtivo" @irParaVerificacaoDeEmail="iniciarVerificacaoCadastro" @voltarTelaParaInicio="voltarTelaLoginInicial"/>
                <div v-if="cadastroVerificado && dadosCadastroPendente" class="erro-cadastro">
                    <p>{{ erroCadastro }}</p>
                    <button class="btn-acessar" :disabled="loadingAtivo" @click="finalizarCadastro">Tentar criar conta novamente</button>
                </div>
            </div>
        </div>
        <div v-if="loadingAtivo" class="container-loading">
            <loading/>
        </div>
        <popup ref="PopupRef" />
    </main>
</template>
<script setup lang="ts">
    import { ref } from 'vue';
    import cabecalho from '../components/cabecalho.vue';
    import { useRouter } from 'vue-router';
    import LoginTelaInicial from "../components/loginCampo.vue";
    import TelaEsqueciSenha from "../components/telaEsqueciSenha.vue";
    import TelaVerificarCodigo from '@/components/telaVerificarCodigo.vue';
    import telaCriarConta from "../components/criarConta.vue";
    import TelaNovaSenha from "../components/telaNovaSenha.vue";
    import loading from "../components/loading.vue";
    import popup from "../components/popup.vue";

    const router = useRouter();
    const loginInicialAtivo = ref(true);
    const telaEsqueciSenhaAtiva = ref(false);
    const verificarCodigoAtivo = ref(false);
    const telaCriarContaAtivo = ref(false);
    const novaSenhaAtiva = ref(false);
    const fluxoVerificacao = ref<"login" | "reset" | "cadastro">("login");
    const loadingAtivo = ref(false);
    const PopupRef = ref<InstanceType<typeof popup> | null>(null);
    const dadosCadastroPendente = ref<{ nome: string; email: string; senha: string } | null>(null);
    const cadastroVerificado = ref(false);
    const erroCadastro = ref("");

    const telaAtivaNesteMomento = ref("loginInicial")

    const mudarTelaParaEsqueciSenha = () =>{
        loginInicialAtivo.value = false;
        telaEsqueciSenhaAtiva.value = true;
        telaAtivaNesteMomento.value = "esqueciSenha"
        fluxoVerificacao.value = "reset";
    }
    const voltarTelaLoginInicial = () =>{
        loginInicialAtivo.value = true;
        verificarCodigoAtivo.value = false;
        telaCriarContaAtivo.value = false;
        telaEsqueciSenhaAtiva.value = false;
        telaAtivaNesteMomento.value = "loginInicial"
        fluxoVerificacao.value = "login";
    }
    const irParaTelaVerificacaoCodigo = () =>{
        loginInicialAtivo.value = false;
        telaCriarContaAtivo.value = false;
        telaEsqueciSenhaAtiva.value = false;
        verificarCodigoAtivo.value = true;
        novaSenhaAtiva.value = false;
    }
    const irParaTelaDeCadastro = () => {
        loginInicialAtivo.value = false;
        telaCriarContaAtivo.value = true;
        telaAtivaNesteMomento.value = "cadastro";
        fluxoVerificacao.value = "cadastro";
    }
    const iniciarVerificacaoCadastro = (dados: { nome: string; email: string; senha: string }) => {
        dadosCadastroPendente.value = dados;
        cadastroVerificado.value = false;
        erroCadastro.value = "";
        fluxoVerificacao.value = "cadastro";
        irParaTelaVerificacaoCodigo();
    }

    /**Verifica de qual tela a verificação de codigo esta vindo */

    const aoVerificarCodigo = async () => {
        loadingAtivo.value = true

        if(fluxoVerificacao.value === "reset") {
            verificarCodigoAtivo.value = false;
            novaSenhaAtiva.value = true;
            loadingAtivo.value = false;
        }
        if(fluxoVerificacao.value === "login"){
            verificarCodigoAtivo.value = false;
            
            try{
                const logar = await fetch("https://echo-moda-2-0.onrender.com/api/authlogin",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    credentials:"include",
                })

                if(logar.status === 200){
                    PopupRef.value?.exibirPopUp("Logado com sucesso")
                    localStorage.setItem("UserLg","Y");
                    setTimeout(()=>{
                        router.push("/")
                    },500)
                }
                if(logar.status === 400){
                    PopupRef.value?.exibirPopUp("Erro ao logar")
                    return
                }
            }catch(erro){
                console.error("Erro ao finalizar login:", erro);
                PopupRef.value?.exibirPopUp("Erro interno do servidor")
            }finally{
                loadingAtivo.value = false;
            }
        }
        if(fluxoVerificacao.value ===  "cadastro"){
            verificarCodigoAtivo.value = false;
            cadastroVerificado.value = true;
            await finalizarCadastro();
        }
    }

    const finalizarCadastro = async () => {
        loadingAtivo.value = true;
        erroCadastro.value = "";
        try{
            if (!dadosCadastroPendente.value) {
                erroCadastro.value = "Dados do cadastro não encontrados. Tente novamente.";
                cadastroVerificado.value = false;
                telaCriarContaAtivo.value = true;
                return;
            }

            const resultadoCadastro = await fetch("https://echo-moda-2-0.onrender.com/api/criar-cadastro",{
                method:"POST",
                headers:{"Content-type":"application/json"},
                credentials:"include",
                body: JSON.stringify(dadosCadastroPendente.value),
            })

            const respostaServidor = await resultadoCadastro.json().catch(() => null);

            if(resultadoCadastro.status === 201){
                cadastroVerificado.value = false;
                dadosCadastroPendente.value = null;
                PopupRef.value?.exibirPopUp("Cadastro realizado com sucesso")
                localStorage.setItem("UserLg","Y");
                setTimeout(()=>{
                    router.push("/")
                },500)
            }else{
                erroCadastro.value = respostaServidor?.erro || "Erro ao criar cadastro";
                PopupRef.value?.exibirPopUp(erroCadastro.value);
            }
        }catch(erro){
            console.error("Erro ao criar cadastro:", erro);
            erroCadastro.value = "Erro interno do servidor. Tente novamente.";
            PopupRef.value?.exibirPopUp(erroCadastro.value);
        }finally{
            loadingAtivo.value = false;
        }
    }
    const irParaHome = () =>{
        router.push("/");
    }

</script>
<style lang ="scss" scoped>
@use "../components-scss/variaveis.scss";

.main-login{
    height: 100vh;
    background: linear-gradient(146deg, rgba(246, 247, 220, 1) 0%, rgba(46, 0, 0, 1) 0%, rgba(117, 90, 0, 1) 96%);
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    .bg-login{
        height: 50vh;
        width: 100%;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%);
                mask-image: linear-gradient(to bottom , rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%);
                filter: brightness(0.5);
        }
    }
    .container-card-login{
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        width: 100%;
        overflow-y: hidden;
        @media(min-width:750px){
            top: 30px;
        }
        .card{
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            overflow-x: hidden;
            position: relative;
            height: 450px;
            @include variaveis.modalSurface;
            @include variaveis.corModais;
            color: #fff;
            width: 70%;
            top: 10px;
            border-radius: 10px;
            padding: variaveis.$space-md variaveis.$space-md;
            @media(min-width:750px){
                width: 40%;
            }
        }
    }
}
.container-loading{
    display: flex;
    left: 0;
    top: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.504);
    width: 100%;
    height: 100%;
    position: absolute;
}
.erro-cadastro{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: variaveis.$space-md;
    text-align: center;
}
</style>