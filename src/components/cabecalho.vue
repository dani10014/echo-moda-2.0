<template>
    <div class="cabecalho">
        <h4 class="cabecalho__nome-loja">Echo Moda</h4>
        <button class="cabecalho__botao-logar" @click="$emit('acao')">
            {{ textoBtn }}
        </button>
    </div>
</template>
<script setup lang = "ts">

    defineProps<{
        textoBtn:string;
    }>()
    
    defineEmits(['acao'])

</script>
<style lang="scss" scoped>
    @use "../components-scss/variaveis.scss";

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
            @include variaveis.fonteNomeLoja;
            margin:0;
        }
        &__botao-logar{
            @include variaveis.padraoBotao;
            font-size: 0.8rem;
            @include variaveis.fontePadraoSite
        }
    }
</style>
