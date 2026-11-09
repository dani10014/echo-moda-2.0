<template>
    <button class="btn-voltar" @click="mudarTela('voltarTelaParaInicio')"><i class="fa-solid fa-arrow-left"></i></button>
    <h1>Cadastro</h1>
    
    <input type="text" v-model="form.nome" placeholder="Nome" @keyup="validarNome">
    <span v-if="resultNomeErro && form.nome.length > 0" class="aviso-campo-invalido">Nome deve ter de 3 a 32 caracteres e não conter números</span>

    <input type="text" v-model="form.email" placeholder="Email" @keyup="validarEmail">
    <span v-if="resultEmailErro && form.email.length > 0" class="aviso-campo-invalido">Email incorreto</span>

    <input v-model="form.senha" type="password" @keyup="validarSenha" placeholder="Senha">
    <span v-if="resultSenhaErro && form.senha.length > 0" class="aviso-campo-invalido">Senha com minimo de 8 caracteres</span>

    <div class="botao-acessar">
        <button class="btn-acessar" @click="criarConta">Prosseguir</button>
    </div>
    <Popup ref="PopupRef"/>

    <div v-if="loadingAtivo === true" class="container-loading">
        <loading/>
    </div>
    
</template>
<script setup lang="ts">
    import {reactive,ref} from "vue"
    import Popup from "./popup.vue"
    import loading from "./loading.vue";

    const form = reactive({
        email:"",
        senha:"",
        nome:"",
    })

    const resultEmailErro = ref(false);
    const resultSenhaErro = ref(false);
    const resultNomeErro = ref(false);
    const PopupRef = ref<InstanceType<typeof Popup> | null>(null);
    const loadingAtivo = ref(false);
    const mudarTela = defineEmits(['irParaVerificacaoDeEmail','voltarTelaParaInicio',"cadastroverificado"])
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }
    const validarSenha = () => {
        resultSenhaErro.value = form.senha.trim().length < 8; 
    }
    const validarNome = () =>{
        const nome = form.nome.trim();
        resultNomeErro.value = nome.length < 3 || nome.length > 32 || /\d/.test(nome);
    }

    const criarConta = async () =>{
        validarNome();
        validarEmail();
        validarSenha();

        if(resultEmailErro.value === false && resultNomeErro.value === false && resultSenhaErro.value === false){
            loadingAtivo.value = true;
        try{
            const respostaVerificaConta = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-cadastro",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                credentials:"include",
                body:JSON.stringify({
                    email:form.email.trim().toLowerCase(),
                })
            })

            if(respostaVerificaConta.status === 200){
                PopupRef.value?.exibirPopUp("Usuario com conta existente");
                return
            }
            if(respostaVerificaConta.status === 400){
                try{
                    const resultadoEnviarCodigo = await fetch("https://echo-moda-2-0.onrender.com/api/enviar-codigo",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        credentials:"include",
                        body:JSON.stringify({
                            email:form.email.trim().toLowerCase()
                        })
                    })
                    if(resultadoEnviarCodigo.status === 200){
                        PopupRef.value?.exibirPopUp("Codigo enviado");
                        sessionStorage.setItem("emailUser",form.email.trim().toLowerCase())
                        
                        setTimeout(()=>{
                            mudarTela("irParaVerificacaoDeEmail", {
                                nome: form.nome.trim(),
                                email: form.email.trim().toLowerCase(),
                                senha: form.senha.trim(),
                            });
                        })
                    }else{
                        const erro = await resultadoEnviarCodigo.json().catch(() => null);
                        PopupRef.value?.exibirPopUp(erro?.erro || "Erro ao enviar código");
                    }
                }catch(erro){
                    console.error("Erro ao enviar código:", erro);
                    PopupRef.value?.exibirPopUp("Erro no servidor");
                }
            }else if(respostaVerificaConta.status !== 400){
                const erro = await respostaVerificaConta.json().catch(() => null);
                PopupRef.value?.exibirPopUp(erro?.erro || "Erro ao verificar cadastro");
            }
        }catch(erro){
            console.error("Erro ao iniciar cadastro:", erro);
            PopupRef.value?.exibirPopUp("Erro no servidor");
        }finally{
            loadingAtivo.value = false;
        }
    }else{
        PopupRef.value?.exibirPopUp("Dados Incorretos");
    }
}
</script>
<style lang="scss" scoped>
    @use "../components-scss/variaveis.scss";

    h1{
        text-align: center;
        font-size: variaveis.$font-size-xl;
        margin-bottom: variaveis.$space-3xl;
        @include variaveis.fontePadraoSite;
    }
    input{
        padding: variaveis.$space-md;
        border: none;
        border-radius: 5px;
        outline: none;
        margin-bottom: variaveis.$space-sm;
        transition: all 0.3s ease-in-out;
        &:focus{
            background-color: rgba(201, 201, 201, 0.53);
            color: #fff;
        }
    }
    .aviso-campo-invalido{
        color: red;
        font-size: variaveis.$space-xs;
        margin-bottom:variaveis.$space-sm;
        @include variaveis.fontePadraoSite;
            &::before{
                content: "* ";
            }
    }
    .botao-acessar{
        display: flex;
        justify-content: center;
        width:100%;
        margin-top: variaveis.$space-xl;
        button{
            width: 50%;
                @include variaveis.padraoBotao
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
    .btn-voltar{
        width: 5%;
        height: 5%;
        cursor: pointer;
        border: none;
        background-color: inherit;
        color: #fff;
        transition: all 0.3s ease-in-out;
        border-radius: 10px;
        &:hover{
            background-color: #ffffff78;
        }
    }
</style>