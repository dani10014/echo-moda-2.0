<template>
    <h2>Login</h2>

    <input type="text" v-model="form.email" placeholder="Email" @keyup="validarEmail">
    <span v-if="resultEmailErro && form.email.length > 0" class="aviso-campo-invalido">Email incorreto</span>

    <input v-model="form.senha" type="text" @keyup="validarSenha" placeholder="Senha">
    <span v-if="resultSenhaErro && form.senha.length > 0" class="aviso-campo-invalido">Senha com minimo de 8 caracteres</span>

    <a href="#" @click="irParaTelaEsqueciSenha" class="btn-esqueci-senha">Esqueci a senha</a>
    <div class="botao-acessar">
        <button class="btn-acessar" @click="Logar">Entrar</button>
    </div>
    <p class="texto-divisor-ou">Ou</p>
    <div class="login-google">
        <googleButton 
            @sucesso = "loginGoogleSucesso"
            @erro = "loginGoogleErro"
        />
    </div>
    <div v-if="dadosCorretos === true" class="container-loading">
        <loading/>
    </div>
    <Popup ref="PopupRef"/>
</template>
<script setup lang="ts">
    import loading from "../components/loading.vue";
    import {ref,reactive} from "vue";
    import googleButton from '../components/googleButton.vue';
    import { useRouter } from 'vue-router';
    import Popup from "../components/popup.vue";



    const form = reactive({
        email:"",
        senha:"",
    })

    const resultEmailErro = ref(false);
    const resultSenhaErro = ref(false);
    const dadosCorretos = ref(false);
    const PopupRef = ref<any>(null);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const router = useRouter()
    
    const mudarTela = defineEmits(['irParaTelaEsqueciSenha']);

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }
    const validarSenha = () => {
        resultSenhaErro.value = form.senha.trim().length < 8; 
    }

    const loginGoogleSucesso = (() => {
        PopupRef.value?.exibirPopUp("Logado com sucesso")

        setTimeout(()=>{
            router.push("/logedPage")
        },500)
    })

    const loginGoogleErro = (() => {
        PopupRef.value?.exibirPopUp("Erro ao logar,tente novamente");
    })

    const irParaTelaEsqueciSenha = (()=>{
        mudarTela('irParaTelaEsqueciSenha');
    })

    const Logar = async () => {
        if(resultEmailErro.value === false && form.email.trim().length > 1 && regex.test(form.email) && resultSenhaErro.value === false && form.senha.trim().length >= 8 ){
            dadosCorretos.value = true;
                try{
                    const resposta = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-cadastro",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        email:form.email,
                    })
                })

                if(resposta.status === 200){
                    PopupRef.value?.exibirPopUp("Prosseguindo para verificação");
                }

                if(resposta.status === 400){
                    PopupRef.value?.exibirPopUp("Email ou senha incorreta");
                }
                }catch(erro){
                    PopupRef.value?.exibirPopUp("Ocorreu um erro");
                }finally{
                    dadosCorretos.value = false;
                }

            }else{
                PopupRef.value?.exibirPopUp("Dados incorretos");
            }
        }

</script>
<style lang="scss" scoped>

    @use "../components-scss/variaveis.scss";

    h2{
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
    .btn-esqueci-senha{
        font-size: variaveis.$font-size-sm;
        margin-top: variaveis.$space-sm;
    }
    .btn-voltar-tela-login{
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
    .texto-divisor-ou{
        text-align: center;
        @include variaveis.fontePadraoSite;
        font-size: variaveis.$font-size-sm;
        margin:variaveis.$space-md 0;
    }
    .login-google{
        display: flex;
        justify-content: center;
    }
</style>