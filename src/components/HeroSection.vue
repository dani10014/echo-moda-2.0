<template>
    <main class="home">
        <header>
            <div class="cabecalho">
                <h3 class="cabecalho__nome-loja">Echo Moda</h3>
                <button class="cabecalho__botao-logar">Entrar</button>
            </div>
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
                <div class="card"
                    v-for="product in produtos"
                    :key="product.id"
                    @click= "abrirModal(product)">
                </div>
            </div>
        </section>
        <Transition name="fade">
            <div v-if="modalAberto" class="modal-overlay" @click.self="modalAberto = false">
                <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                    <button class="modal-close" @click="modalAberto = false" aria-label="Fechar modal">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <div class="modal-visual">
                        <div
                            class="modal-image"
                            :style="{
                                backgroundImage: 'url(' + produtoSelecionado?.imagem + ')',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }"
                        ></div>
                    </div>

                    <div class="modal-body">
                        <span class="modal-category">Echo Moda</span>
                        <h2 id="modal-title" class="nome-produto">{{ produtoSelecionado?.name }}</h2>
                        <p class="modal-description">
                            Peça exclusiva com design moderno, acabamento refinado e conforto para o dia a dia.
                        </p>

                        <div class="modal-info">
                            <div class="info-item">
                                <span>Entrega</span>
                                <strong>Em 3 a 5 dias</strong>
                            </div>
                            <div class="info-item">
                                <span>Pagamento</span>
                                <strong>Até 12x</strong>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <div class="preco-wrap">
                                <span>Valor</span>
                                <h5 class="preco-produto">{{ produtoSelecionado?.preco }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </main>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';


import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

import {ref} from "vue";


interface produto{
    id:number | null;
    name:string | null;
    preco:string | null;
    imagem:string;
}

const modalAberto = ref(false);
const produtoSelecionado = ref<produto | null>(null) ;

const abrirModal = (product:produto) =>{
    modalAberto.value = true,
    produtoSelecionado.value = product
}

const produtos = [
    { id: 2, name: 'Jaqueta Jeans Oversized', preco: 'R$ 249,90', imagem:"./src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png"},
    { id: 3, name: 'Calça Alfaiataria', preco: 'R$ 159,90' , imagem:"./src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png"},
    { id: 4, name: 'Vestido Midi Casual', preco: 'R$ 179,90', imagem:"./src/assets/images/Gemini_Generated_Image_uy7iaguy7iaguy7i.png" },
];

const modules = [Pagination, Navigation];

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
    header{
        .cabecalho{
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 2000;
            padding: 1rem 2rem;
            box-sizing: border-box;
            &__nome-loja{
                color: #fff;
                @include variaveis.fonteNomeLoja
            }
            &__botao-logar{
                @include variaveis.padraoBotao;
                @include variaveis.fontePadraoSite
            }
        }
    }
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
            padding: 0 5rem;
            h1{
                margin-bottom: 0;
                @include variaveis.fontePadraoSite;
                text-align: center;
                margin-bottom: 2rem;
                @media(min-width:750px){
                    text-align: start;
                }
            }
            p{
                margin-top: 0;
                margin-bottom: 0;
                font-size: 0.9rem;
                text-align: center;
                @include variaveis.fontePadraoSite;
            }
            ul{
                margin: 2rem 0;
                @include variaveis.fontePadraoSite;
                display: flex;
                font-size: 0.5rem;
                padding: 0;
                justify-content: center;
                gap: 1rem;
                @media(min-width:750px){
                    display: block;
                    font-size: 1rem;
                    padding:0 5rem;
                }
            }
            .btn-catalogo{
                @include variaveis.padraoBotao;
                @include variaveis.fontePadraoSite;
                width: 100%;
            }
            .tags-seguranca{
                font-size: 0.7rem;
                display: flex;
                width: 100%;
                margin-top: 3rem;
                justify-content: space-between;
                a{
                    color: #fff;
                    text-decoration: none;
                }
            }
        }
    }
    .modal-overlay{
        position: fixed;
        inset: 0;
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: variaveis.$space-lg;
        background: variaveis.$color-bg-overlay;
        backdrop-filter: blur(8px);
    }

    .modal-content{
        position: relative;
        width: min(100%, 760px);
        display: grid;
        grid-template-columns: 1fr 1fr;
        overflow: hidden;
        border-radius: variaveis.$radius-lg;
        @include variaveis.modalSurface;

        @media (max-width: 700px) {
            grid-template-columns: 1fr;
        }
    }

    .modal-close{
        position: absolute;
        top: variaveis.$space-md;
        right: variaveis.$space-md;
        z-index: 2;
        width: 2.2rem;
        height: 2.2rem;
        border: 1px solid rgba(255, 255, 255, 0.16);
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.35);
        color: variaveis.$color-white;
        font-size: variaveis.$font-size-lg;
        cursor: pointer;
        transition: transform 0.2s ease, background 0.2s ease;

        &:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.12);
        }
    }

    .modal-visual{
        position: relative;
        min-height: 320px;
        background: variaveis.$color-bg-card;
    }

    .modal-image{
        width: 100%;
        height: 100%;
        min-height: 320px;
    }

    .modal-body{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: variaveis.$space-xl variaveis.$space-xl variaveis.$space-lg;
        color: variaveis.$color-white;
    }

    .modal-category{
        display: inline-block;
        width: fit-content;
        margin-bottom: variaveis.$space-xs;
        color: variaveis.$color-gold;
        font-size: variaveis.$font-size-xs;
        letter-spacing: variaveis.$letter-spacing-md;
        text-transform: uppercase;
    }

    .nome-produto{
        @include variaveis.fonteNomeLoja;
        margin: 0;
        color: variaveis.$color-white;
        font-size: clamp(variaveis.$font-size-xl, 2vw, variaveis.$font-size-3xl);
        line-height: 1.2;
    }

    .modal-description{
        margin: variaveis.$space-md 0 variaveis.$space-xl;
        color: variaveis.$color-white-soft;
        line-height: 1.6;
        font-size: variaveis.$font-size-md;
    }

    .modal-info{
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.9rem;
        margin-bottom: variaveis.$space-xl;
    }

    .info-item{
        padding: 0.9rem 1rem;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: variaveis.$radius-md;

        span{
            display: block;
            margin-bottom: variaveis.$space-xxs;
            color: variaveis.$color-white-muted;
            font-size: variaveis.$font-size-sm;
            text-transform: uppercase;
            letter-spacing: variaveis.$letter-spacing-sm;
        }

        strong{
            color: variaveis.$color-white;
            font-size: 0.92rem;
            font-weight: 600;
        }
    }

    .modal-footer{
        display: flex;
        justify-content: space-between;
        align-items: end;
        gap: variaveis.$space-md;

        @media (max-width: 700px) {
            flex-direction: column;
            align-items: stretch;
        }
    }

    .preco-wrap{
        span{
            display: block;
            color: variaveis.$color-white-muted;
            font-size: variaveis.$font-size-sm;
            letter-spacing: variaveis.$letter-spacing-sm;
            text-transform: uppercase;
        }
    }

    .preco-produto{
        @include variaveis.fontePadraoSite;
        margin: 0.25rem 0 0;
        color: variaveis.$color-white;
        font-size: variaveis.$font-size-2xl;
        font-weight: 700;
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
            height: 250px;
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
}
</style>