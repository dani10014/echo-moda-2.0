<template>
    <h1>Cadastro</h1>
    
    <input type="text" v-model="form.nome" placeholder="Nome" @keyup="validarNome">
    <span v-if="resultNomeErro && form.nome.length > 0" class="aviso-campo-invalido">Nome com minimo de 3 caracteres</span>

    <input type="text" v-model="form.email" placeholder="Email" @keyup="validarEmail">
    <span v-if="resultEmailErro && form.email.length > 0" class="aviso-campo-invalido">Email incorreto</span>

    <input v-model="form.senha" type="text" @keyup="validarSenha" placeholder="Senha">
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
    import {useRouter} from "vue-router";
    import loading from "./loading.vue";

    const form = reactive({
        email:"",
        senha:"",
        nome:"",
    })

    const resultEmailErro = ref(false);
    const resultSenhaErro = ref(false);
    const resultNomeErro = ref(false);
    const PopupRef = ref<any>(null);
    const loadingAtivo = ref(false);
    const mudarTela = defineEmits(['irParaVerificacaoDeEmail'])
    
    const router = useRouter();

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }
    const validarSenha = () => {
        resultSenhaErro.value = form.senha.trim().length < 8; 
    }
    const validarNome = () =>{
        if(form.nome.length > 3){
            resultNomeErro.value = false;
        }else{
            resultNomeErro.value = true
        }
    }

    const criarConta = async () =>{
        if(resultEmailErro.value === false && resultNomeErro.value === false && resultSenhaErro.value === false){
            loadingAtivo.value = true;
        try{
            const respostaVerificaConta = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-cadastro",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    email:form.email.trim(),
                })
            })

            if(respostaVerificaConta.status === 200){
                PopupRef.value.exibirPopUp("Usuario com conta existente");
                return
            }
            if(respostaVerificaConta.status === 400){
                try{
                    const resultadoEnviarCodigo = await fetch("https://echo-moda-2-0.onrender.com/api/enviar-codigo",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                            email:form.email
                        })
                    })
                    if(resultadoEnviarCodigo.status === 200){
                        PopupRef.value.exibirPopUp("Codigo enviado");
                        mudarTela("irParaVerificacaoDeEmail");
                    }
                    if(resultadoEnviarCodigo.status === 400){
                        PopupRef.value.exibirPopUp("Erro ao enviar código");
                    }
                }catch(erro){
                    PopupRef.value.exibirPopUp("Erro no servidor");
                }
            }
        }catch(erro){
            PopupRef.value.exibirPopUp("Erro no servidor");
        }finally{
            loadingAtivo.value = false;
        }
    }else{
        PopupRef.value.exibirPopUp("Dados Incorretos");
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
</style>