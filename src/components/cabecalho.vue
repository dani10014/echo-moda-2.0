<template>
    <div class="cabecalho">
        <h4 class="cabecalho_nome-loja">Echo Moda</h4>
        <div class="container-botoes-cabecalho">
            <button @click = "$emit('abrirMenu')" class="btn-menu">
                <span>
                </span>
                <span>
                </span>
                <span>
                </span>
            </button>
            <button class="botao-logar" @click="$emit('acao')">
                {{ textoBtn }}
            </button>
        </div>
    </div>
</template>
<script setup lang = "ts">

    defineProps<{
        textoBtn:string;
    }>()
    
    defineEmits(['acao','abrirMenu'])

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
        padding: 2rem 2rem;
        box-sizing: border-box;
        font-size: 1rem;
        &_nome-loja{
            color: #fff;
            @include variaveis.fonteNomeLoja;
            margin:0;
        }
        .container-botoes-cabecalho{
            display: flex;
            gap: variaveis.$space-md;
            .botao-logar{
                @include variaveis.padraoBotao;
                @include variaveis.fontePadraoSite;
                cursor: pointer;
            }
            .btn-menu{
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                background-color: inherit;
                border: none;
                cursor: pointer;
                span{
                    display: block;
                    width: 50px;
                    height: 2px;
                    background-color: #fff;
                }
            }
        }
    }
</style>
