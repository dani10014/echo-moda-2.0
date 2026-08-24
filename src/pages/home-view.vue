<template>
    <main class="home">
        <header>
            <cabecalho
                textoBtn="Entrar"
                @abrirMenu = "ativarMenuDrop"
                @acao="irParaLogin"
            />
        </header>
        <section class="hero-section">
            <div class="bg-desfoque">
                <div class="hero-section_seja-bem-vindo">
                    <h1>Seja Bem Vindo</h1>
                    <p>A loja Vintage mais completa do Brasil</p>
                    <ul>
                        <li>Vintage</li>
                        <li>Segurança</li>
                        <li>Envio rapido</li>
                        <li>Preço baixo</li>
                    </ul>
                    <button class="btn-catalogo">Explorar</button>
                    <div class="tags-seguranca">
                        <a href=""><i class="fa-solid fa-circle-info"></i> Segurança</a>
                        <a href=""><i class="fa-solid fa-circle-info"></i> Pagamento</a>
                        <a href=""><i class="fa-solid fa-circle-info"></i> Envios</a>
                    </div>
                </div>
            </div>
        </section>
        <section class="catalogo-section">
            <h2 class="texto-destaque">Destaque</h2>
            <div class="botoes-categorias">
                <button class=""></button>
                <button class=""></button>
                <button class=""></button>
                <button class=""></button>
                <button class=""></button>
            </div>
            <div class="container-cards">
                <CardProduto
                    v-for="produto in produtos"
                    :key="produto.id"
                    :produto="produto"
                />
            </div>
        </section>
        <Transition name="fade">
            <div v-if="menuDropEstaAtivo" class="menu-drop">
                <button><i class="fa-solid fa-house"></i> Home</button>
                <button><i class="fa-solid fa-fire"></i> Destaque</button>
                <button><i class="fa-solid fa-comment"></i> Mensagems</button>
                <button><i class="fa-solid fa-shirt"></i> Produtos</button>
                <button><i class="fa-solid fa-headset"></i> Fale conosco</button>
            </div>
        </Transition>
    </main>
</template>

<script setup lang="ts">
import CardProduto from '../components/card-produto.vue'
import Loading from "../components/loading.vue";
import Cabecalho from '../components/cabecalho.vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
let menuDropEstaAtivo = ref(false);

const ativarMenuDrop = () =>{
    menuDropEstaAtivo.value = !menuDropEstaAtivo.value;
}

const produtos = [
    { id: 2, name: 'Jaqueta Jeans Oversized', preco: 'R$ 249,90', imagem: '/src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png' },
    { id: 3, name: 'Calça Alfaiataria', preco: 'R$ 159,90', imagem: '/src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png' },
    { id: 4, name: 'Vestido Midi Casual', preco: 'R$ 179,90', imagem: '/src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png' },
]
const irParaLogin = () => {
    router.push("/login")
}



</script>

<style lang="scss" scoped>
@use "../components-scss/variaveis.scss";

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.home{
    position: relative;
    @include variaveis.corPaginaPadrao;
    min-height: 100vh;
    color: #fff;
    background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45));
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    .hero-section{
        background-color: #fff;
        background-image: url("../assets/images/hero-background.png");
        background-size: cover;
        background-position: center;
        height: 100vh;
        .bg-desfoque{
            background-color: rgba(0, 0, 0, 0.748);
            display: flex;
            align-items: center;
            text-align: star;
            @media(min-width:750px){
                text-align: start;
            }
            min-height: 100vh;
        }
        &_seja-bem-vindo{
            padding: 0 2rem;
            width: 100%;
            @media(min-width:750px){
                padding: 0 5rem;
                width:30%;
            }
            h1{
                margin-bottom: 0;
                @include variaveis.fontePadraoSite;
                text-align: center;
                margin-bottom: 2rem;
                @media(min-width:750px){
                    text-align: center;
                }
            }
            p{
                margin-top: 0;
                margin-bottom: 0;
                font-size: 0.9rem;
                text-align: center;
                @include variaveis.fontePadraoSite;
                @media(min-width:750px){
                    text-align: center;
                }
            }
            ul{
                margin: variaveis.$space-xl 0;
                @include variaveis.fontePadraoSite;
                display: flex;
                font-size: 0.5rem;
                padding: 0;
                justify-content: center;
                gap: 1rem;
                @media(min-width:750px){
                    display: flex;
                    text-align: justify;
                    justify-content: center;
                }
            }
            .btn-catalogo{
                @include variaveis.padraoBotao;
                @include variaveis.fontePadraoSite;
                width: 100%;
                cursor: pointer;
            }
            .tags-seguranca{
                font-size: 0.7rem;
                display: flex;
                width: 100%;
                margin-top: 3rem;
                justify-content: space-between;
                cursor: pointer;
                a{
                    color: #fff;
                    text-decoration: none;
                }
            }
        }
    }
    
    .catalogo-section{
            min-height: 100vh;
            background: #f6f7dc;
            background: linear-gradient(146deg, rgba(246, 247, 220, 1) 0%, rgba(46, 0, 0, 1) 0%, rgba(117, 90, 0, 1) 96%);
        .texto-destaque{
            text-align: center;
            margin: 0;
            padding: 5rem;
            @include variaveis.fontePadraoSite;
        }
        .botoes-categorias{
            display: flex;
            justify-content: center;
            gap: 2rem;
            cursor: pointer;
            @media(min-width:750px){
                gap: 5rem;
            }
            margin-bottom: 5rem;
            button{
                height: 20px;
                width:20px;
                border-radius: 50%;
                border: none;
                transition: all 0.3s ease-in-out;
                background-image: url("../assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png");
                &:hover{
                    transform:scale(1.5);
                    border: 2px solid #fff;
                }
            }
        }
        .container-cards{
            display:flex;
            justify-content: center;
            flex-direction: column;
            margin: 0 5rem;
            height: 350px;
            padding-bottom: variaveis.$space-md;
            gap:5rem;
            @media(min-width:750px){
                flex-direction: row;
            }
            .card{
                height: 100%;
                width: 100%;
                -webkit-mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%);
                mask-image: radial-gradient(circle, rgba(0, 0, 0, 1) 65%, rgba(0, 0, 0, 0) 100%);
                background-color: #fff;
                transition: all 0.3s ease-in-out;
                &:hover{
                    transform: scale(1.1);
                    border: 1px solid ;
                    box-shadow: 0 0 0 5px #fff;
                }
            }
        }
    }
    .menu-drop{
        display: flex;
        flex-direction: column;
        background-color: #fff;
        position: fixed;
        top:100px;
        right:60px;
        width: 50%;
        height: 250px;
        border-radius: 10px;
        box-shadow: variaveis.$shadow-soft;
        @media(min-width:750px){
            width: 20%;
            right: 100px;
        }
        button{
            height: 100%;
            border: none;
            transition: all 0.3s ease-in-out;
            border-radius: 10px;
            @include variaveis.fontePadraoSite;
            color: black;
            cursor: pointer;
            text-align: start;
            padding:variaveis.$space-md;
            @include variaveis.hoverbotoes;
        }
    }
}
</style>