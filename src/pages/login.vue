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
        <div class="container-base-card">
            <div class="card-login">
                <button v-if="esqueciSenha === true " class="voltar-login" @click="voltarLogin">Voltar</button>
                <h2 v-if="esqueciSenha === false ">login</h2>
                <h2 v-if="esqueciSenha === true ">Email para recuperação</h2>
                <div class="inputs">
                    <input v-model="form.email" type="text" @input="validarEmail()" placeholder="Email">
                    <span  v-if="resultEmailErro === true" class="invalido-mensagem">* Email incorreto</span>

                    <input v-if="esqueciSenha === false" v-model="form.senha" type="password" @input="validarSenha()" placeholder="Senha">
                    <span v-if="resultSenhaErro === true" class="invalido-mensagem">* Senha precisa conter 8 caracteres minimo</span>
                    
                    <a href="#" v-if="esqueciSenha === false" @click="esqueciAsenha" class="esqueci-a-senha-btn">Esqueci a senha</a>

                    <div class="btn-acessar">
                        <button v-if="esqueciSenha === false" @click="Logar">Entrar</button>
                        <button v-else @click="Logar">Prosseguir</button>
                    </div>

                    <p v-if="esqueciSenha === false" class="texto-ou-logar-google">Ou</p>
                    <div v-if="esqueciSenha === false" class="container-login-google">
                        <button class="google"></button>
                        <button class="facebook"></button>
                    </div>
                </div>
                <div v-if="dadosCorretos === true" class="container-loading">
                    <loading/>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
    import { reactive,ref } from 'vue';
    import cabecalho from '../components/cabecalho.vue';
    import Loading from "../components/loading.vue";
    import { useRouter } from 'vue-router';
    import Popoup from "../components/popup.vue";

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

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }

    const validarSenha = () => {
        resultSenhaErro.value = form.senha.trim().length < 8; 
    }
    
    const esqueciAsenha = () =>{
        esqueciSenha.value = true
    }

    const voltarLogin = () =>{
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
                        alert("codigo enviado");
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
                        alert("Usuario existe");
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
    .container-base-card{
        display: flex;
        justify-content: center;
        .card-login{
            background-color: #fff;
            @include variaveis.modalSurface;
            @include variaveis.modalTextMuted;
            height: 450px;
            width: 80%;
            position: absolute;
            top: 200px;
            border-radius: 10px;
            padding:0 variaveis.$space-md;
            .voltar-login{
                @include variaveis.padraoBotao;
                margin-top: variaveis.$space-sm;
            }
            @media(min-width:750px){
                top: 100px;
                width: 50%;
            }
            h2{
                text-align: center;
                @include variaveis.fontePadraoSite;
            }
            .container-loading{
                display: flex;
                justify-content: center;
                align-items: center;
                position: absolute;
                z-index: 1000;
                width: 100%;
                background-color: rgba(0, 0, 0, 0.734);
                top: 0;
                height: 100%;
            }
            .inputs{
                display: flex;
                flex-direction: column;
                justify-self: center;
                margin: 2rem variaveis.$space-xxs;
                gap:10px;
                transition: alll 0.3s ease-in-out;
                @media(min-width:750px){
                    margin: 2rem variaveis.$space-3xl;
                }
                input{
                    padding: variaveis.$space-md;
                    border-radius: 10px;
                    border: none;
                    &:focus{
                        outline:2px solid rgba(117, 90, 0, 1) ;
                    }
                }
                .invalido-mensagem{
                    color: red;
                    font-size: variaveis.$font-size-sm;
                    
                }
                .btn-acessar{
                    display: flex;
                    margin-top: variaveis.$space-md;
                    width: 100%;
                    justify-content: center;
                    button{
                        width: 50%;
                        align-items: center;
                        padding:variaveis.$space-md;
                        border-radius: 10px;
                        border: none;
                    }
                }
                .esqueci-a-senha-btn{
                    text-align: start;
                    font-size: variaveis.$font-size-sm;
                }
                .texto-ou-logar-google{
                    text-align: center;
                }
                .container-login-google{
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    button{
                        width: 30%;
                    }
                } 
            }
        }
    }
}
</style>