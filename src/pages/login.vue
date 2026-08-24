<template>
    <main class="main-login">
        <header>
            <cabecalho
                textoBtn="Voltar"
                @acao="irParaHome"
            />
        </header>
        <div class="bg-login">
            <img src="../assets/images/hero-background.png">
        </div>
        <div class="container-card-login">
            <div class="card">
                <button v-if="esqueciSenha" class="btn-voltar-tela-login" @click="voltarTelaLogin">X</button>
                <h2 v-if="!esqueciSenha">Login</h2>
                <h2 v-if="esqueciSenha">Email</h2>
                
                <input type="text" v-model="form.email" placeholder="Email" @keyup="validarEmail">
                <span v-if="resultEmailErro && form.email.length > 0" class="aviso-campo-invalido">Email incorreto</span>

                <input v-if="!esqueciSenha" v-model="form.senha" type="text" @keyup="validarSenha" placeholder="Senha">
                <span v-if="resultSenhaErro && !esqueciSenha && form.senha.length > 0" class="aviso-campo-invalido">Senha com minimo de 8 caracteres</span>

                <a href="#" v-if="!esqueciSenha" @click="esqueciAsenha" class="btn-esqueci-senha">Esqueci a senha</a>
                <div class="botao-acessar">
                    <button class="btn-acessar" @click="Logar">Entrar</button>
                </div>
                <div v-if="dadosCorretos === true" class="container-loading">
                    <loading/>
                </div>
            </div>
        </div>
        <Popup ref="popupRef"/>
    </main>
</template>
<script setup lang="ts">
    import { reactive,ref } from 'vue';
    import cabecalho from '../components/cabecalho.vue';
    import Loading from "../components/loading.vue";
    import { useRouter } from 'vue-router';
    import Popup from "../components/popup.vue";

    const router  = useRouter();

    let form = reactive({
        email:"",
        senha:"",
    })
    
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let resultEmailErro = ref(false) ;
    let resultSenhaErro = ref(false) ;
    let esqueciSenha = ref(false);
    let dadosCorretos = ref(false);
    const popupRef = ref<any>(null);

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }

    const validarSenha = () => {
        resultSenhaErro.value = form.senha.trim().length < 8; 
    }

    const esqueciAsenha = () =>{
        esqueciSenha.value = true
    }

    const voltarTelaLogin = () =>{
        esqueciSenha.value = false
    } 

    const Logar = async () =>{
        if(esqueciSenha.value === true){
            if(resultEmailErro.value === false && form.email.trim().length > 1 && regex.test(form.email)){
                dadosCorretos.value = true;

                try{
                    const resposta = await fetch("https://ecomerce-echomoda.onrender.com/api/enviar-codigo",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                            email:form.email,
                        })
                    })

                    if(resposta.status === 200){
                        alert("Codigo enviado")
                    }
                    if(resposta.status === 400){
                        alert("Errod")
                    }
                }catch(erro){
                        alert("Algo deu errado com o server");
                }finally{
                    dadosCorretos.value = false
                }
            }else{
                alert("Dados incorretos")
            }

        }else if(esqueciSenha.value === false){
            if(resultEmailErro.value === false && form.email.trim().length > 1 && regex.test(form.email) && resultSenhaErro.value === false && form.senha.trim().length >= 8 ){

                dadosCorretos.value = true;

                let nome:string = "Dijalma Duarte Fleitas"; 

                try{
                    const resposta = await fetch("https://ecomerce-echomoda.onrender.com/api/verificar-cadastro",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                            nome:nome,
                            email:form.email.trim(),
                            senha:form.senha.trim(),
                        })
                    })

                    if(resposta.status === 200){
                        popupRef.value?.exibirPopUp("Usuario possui conta");
                    }
                    if(resposta.status === 400){
                        alert("Usuario não existe")
                    }
                }catch(erro){
                        alert("Algo deu errado com o server");
                }finally{
                    dadosCorretos.value = false
                }
            }else{
                alert("Dados incorretos");
            }
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
            height: 400px;
            @include variaveis.modalSurface;
            @include variaveis.corModais;
            color: #fff;
            width: 80%;
            top: 50px;
            border-radius: 10px;
            padding: variaveis.$space-md;
            @media(min-width:750px){
                width: 40%;
            }
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
        }
    }
}
</style>