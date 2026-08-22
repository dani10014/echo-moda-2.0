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
                <h2>Login</h2>
                <input type="text" placeholder="email">
                <input type="text" placeholder="senha">
            </div>
        </div>
        <div v-if="dadosCorretos === true" class="container-loading">
            <loading/>
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
        .card{
            display: flex;
            flex-direction: column;
            overflow-y: hidden;
            overflow-x: hidden;
            height: 450px;
            background-color: black;
            color: #fff;
            width: 80%;
            border-radius: 10px;
            h2{
                text-align: center;
                
            }
            input{
                width: 100%;
            }
        }
    }
}
</style>