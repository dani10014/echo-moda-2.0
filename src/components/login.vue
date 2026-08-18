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
                <h2>login</h2>
                <div class="inputs">
                    <input v-model="form.email" type="text" @input="verificaForm()" placeholder="Email">
                    <span  v-if="resultEmailErro" class="invalido-mensagem">* Email incorreto</span>

                    <input v-model="form.senha" type="text" @input="verificaForm()" placeholder="Senha">
                    <span v-if="resultSenhaErro" class="invalido-mensagem">* Senha precisa conter 8 caracteres minimo</span>

                    <div class="btn-acessar">
                        <button>Entrar</button>
                    </div>

                    <p class="texto-ou-logar-google">Ou</p>
                    <div class="container-login-google">
                        <button class="google"></button>
                        <button class="facebook"></button>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script setup lang="ts">
    import { reactive } from 'vue';
    import cabecalho from './cabecalho.vue';
    import { useRouter } from 'vue-router';
    import {ref} from "vue";

    const router  = useRouter();

    let form = reactive({
        email:"",
        senha:"",
    })

    let resultEmailErro = ref(false) ;
    let resultSenhaErro = ref(false) ;
    
    function verificaForm(){

        if(!form.email.trim().includes("@")){
            resultEmailErro.value = true;
        }else{
            resultEmailErro.value = false;
        }
        if(form.senha.trim().length < 8){
            resultSenhaErro.value = true;
        }else{
            resultSenhaErro.value = false;
        }
    }

    console.log(form)
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
            padding: 0 variaveis.$space-lg;
            height: 450px;
            width: 70%;
            position: absolute;
            top: 200px;
            border-radius: 10px;
            @media(min-width:750px){
                top: 100px;
                width: 50%;
            }
            h2{
                text-align: center;
                @include variaveis.fontePadraoSite;
            }
            .inputs{
                display: flex;
                flex-direction: column;
                justify-self: center;
                margin: 2rem variaveis.$space-sm;
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