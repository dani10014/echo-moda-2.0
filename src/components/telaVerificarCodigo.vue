<template>
    <h2>Codigo enviado para:</h2>
    <p>{{ emailuser }} </p>
    <div class="linha-inputs-codigo">
        <input v-model="espacoCodigo.codigo1" type="text">
        <input v-model="espacoCodigo.codigo2" type="text">
        <input v-model="espacoCodigo.codigo3" type="text">
        <input v-model="espacoCodigo.codigo4" type="text">
        <input v-model="espacoCodigo.codigo5" type="text">
        <input v-model="espacoCodigo.codigo6" type="text">
    </div>
    <span v-if="codigoInvalido" class="codigo-invalido">Código inválido</span>

    <div class="botao-acessar">
        <button class="btn-acessar" @click="validarCodigoDigitado">Prosseguir</button>
    </div>
    <span>Verifique sua caixa de span ou lixeira</span>
    <popup ref="PopupRef"/>
</template>
<script setup lang="ts">
import { reactive,ref } from 'vue';
import popup from './popup.vue';
import { useRouter } from 'vue-router';
    const props = defineProps<{ fluxo: "login" | "reset" }>();
    const emailuser = sessionStorage.getItem("emailUser");

    const espacoCodigo = reactive({
        codigo1:"",
        codigo2:"",
        codigo3:"",
        codigo4:"",
        codigo5:"",
        codigo6:"",
    })

    const codigoFoiVerificado = defineEmits(["codigoVerificado"])

    const codigoCompleto = ref("");

    const codigoInvalido = ref(false)
    
    const PopupRef = ref<any>(null);
    const router = useRouter();

    const validarCodigoDigitado = (()=>{
        codigoCompleto.value = "";
    
        if(!espacoCodigo.codigo1 || !espacoCodigo.codigo2 || !espacoCodigo.codigo3 || !espacoCodigo.codigo4 || !espacoCodigo.codigo5 || !espacoCodigo.codigo6){
            codigoInvalido.value = true;
        }else{
            Object.values(espacoCodigo).forEach((digito: string) => {
                codigoCompleto.value = codigoCompleto.value + digito
            });
                codigoInvalido.value = false;
                verificarCodigo()
        }
    })
    const verificarCodigo = async () =>{
        if(codigoInvalido.value === false){
            try{
                const envioCodigo = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-codigo",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    credentials:"include",
                    body:JSON.stringify({
                        email:emailuser?.trim().toLowerCase(),
                        codigo:codigoCompleto.value,
                        fluxo: props.fluxo,
                    })
                })
                if(envioCodigo.status === 200){
                    PopupRef.value?.exibirPopUp("Código verificado");
                    codigoFoiVerificado("codigoVerificado");
                }
                if(envioCodigo.status === 400){
                    PopupRef.value?.exibirPopUp("Código inválido");
                    codigoCompleto.value = ""
                    return
                }
        }catch(erro){
            PopupRef.value?.exibirPopUp("Erro intérno do servidor");
        }
        }
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
    .codigo-invalido{
        color: red;
    }

</style>