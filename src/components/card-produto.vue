<template>
    <article class="product-card" @click="abrirModal">
        <div class="product-image" :style="{ backgroundImage: 'url(' + produto.imagem + ')' }"></div>
        <div class="product-body">
            <span class="product-label">Echo Moda</span>
            <h3>{{ produto.name }}</h3>
            <p>{{ produto.preco }}</p>
        </div>
    </article>

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
                            backgroundImage: 'url(' + produto.imagem + ')',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }"
                    ></div>
                </div>

                <div class="modal-body">
                    <span class="modal-category">Echo Moda</span>
                    <h2 id="modal-title" class="nome-produto">{{ produto.name }}</h2>
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
                            <h5 class="preco-produto">{{ produto.preco }}</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Produto {
    id: number
    name: string
    preco: string
    imagem: string
}

const props = defineProps<{ produto: Produto }>()
const modalAberto = ref(false)

const abrirModal = () => {
    modalAberto.value = true
}
</script>
<style lang="scss" scoped>
    @use "../components-scss/variaveis.scss" as variaveis;
    
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
    .product-card {
        width: 100%;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        cursor: pointer;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    }

    .product-image {
        width: 100%;
        height: 220px;
        background-size: cover;
        background-position: center;
    }

    .product-body {
        padding: 1rem;
        color: #111;
    }

    .product-label {
        display: inline-block;
        margin-bottom: 0.5rem;
        font-size: 0.7rem;
        letter-spacing: 0.12rem;
        text-transform: uppercase;
        color: #8b6f2c;
    }

    .product-body h3 {
        margin: 0 0 0.5rem;
        font-size: 1.1rem;
    }

    .product-body p {
        margin: 0;
        font-weight: 700;
        color: #000;
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

</style>
    