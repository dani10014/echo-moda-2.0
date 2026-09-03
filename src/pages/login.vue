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
                <LoginTelaInicial v-if="loginInicialAtivo" @irParaTelaEsqueciSenha="mudarTelaParaEsqueciSenha"/>
                <TelaEsqueciSenha v-if="telaEsqueciSenhaAtiva" @voltarAoLoginInicial="voltarTelaLoginInicial"/>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
    import { reactive,ref } from 'vue';
    import cabecalho from '../components/cabecalho.vue';
    import { useRouter } from 'vue-router';
    import LoginTelaInicial from "../components/loginCampo.vue";
    import TelaEsqueciSenha from "../components/telaEsqueciSenha.vue";


    const router = useRouter();
    const loginInicialAtivo = ref(true);
    const telaEsqueciSenhaAtiva = ref(false);

    const mudarTelaParaEsqueciSenha = () =>{
        loginInicialAtivo.value = false;
        telaEsqueciSenhaAtiva.value = true;
    }
    const voltarTelaLoginInicial = () =>{
        loginInicialAtivo.value = true;
        telaEsqueciSenhaAtiva.value = false;
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
            width: 80%;
            top: 30px;
            border-radius: 10px;
            padding: variaveis.$space-md variaveis.$space-xl;
            @media(min-width:750px){
                width: 40%;
            }
        }
    }
}
</style>