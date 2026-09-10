<template>
    <h2>Codigo enviado para:</h2>
    <p>{{ emailuser }} </p>
    <div class="linha-inputs-codigo">
        <input type="text">
        <input type="text">
        <input type="text">
        <input type="text">
        <input type="text">
        <input type="text">
    </div>
    <span>Código inválido</span>
    <div class="botao-acessar">
        <button class="btn-acessar" @click="">Prosseguir</button>
    </div>
    <span>Verifique sua caixa de span ou lixeira</span>
</template>
<script setup lang="ts">
import { reactive,ref } from 'vue';
    
    const emailuser = localStorage.getItem("emailUser");

    const espacoCodigo = reactive({
        codigo1:"",
        codigo2:"",
        codigo3:"",
        codigo4:"",
        codigo5:"",
        codigo6:"",
    })

    const codigoInvalido = ref(false)

    if(!espacoCodigo.codigo1 || !espacoCodigo.codigo2 || !espacoCodigo.codigo3 || espacoCodigo.codigo4 || !espacoCodigo.codigo5 || !espacoCodigo.codigo6){
        codigoInvalido.value = true;
    } 

</script>
<style lang="scss" scoped>
    @use "../components-scss/variaveis.scss";

    h2{
        text-align: center;
        font-size: variaveis.$font-size-xl;
        
        @include variaveis.fontePadraoSite;
    }
    p{
        text-align: center;
        margin-top: 0;
        margin-bottom: variaveis.$space-3xl;
        font-size: variaveis.$font-size-md;
    }
    span{
        text-align: center;
        font-size: variaveis.$font-size-xs;
        color: grey;
        &::before{
            content: "* ";
        }
    }
    .linha-inputs-codigo{
        display: flex;
        gap: 5px;
        height: 10%;  
        margin-bottom: variaveis.$space-3xl;
        @media(min-width:750px){
            height: 15%;

        }
        input{
            width: 100%;
            border-radius: variaveis.$radius-lg;
            border: none;
            text-align: center;
            box-shadow: variaveis.$shadow-modal;
            transition: all 0.3s ease-in-out;
            outline: none;
            @media(min-width:750px){
                border-radius: variaveis.$radius-pill;
            }
            &:focus{
                transform: scale(1.1);
                box-shadow: variaveis.$shadow-modal;
                outline: variaveis.$color-gold 1px solid;
            }
        }
    }
    .botao-acessar{
        display: flex;
        justify-content: center;
        width:100%;
        margin-top: variaveis.$space-xl;
        margin-bottom: variaveis.$space-3xl;
        button{
            width: 50%;
                @include variaveis.padraoBotao
            }
    }

</style>