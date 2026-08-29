<template>
        <div class=container-popup>
            <Transition name="slide">
                <div v-if="popupAtivo" class="popoup-aviso">
                    <span>{{ textoPopUp }}</span>
                </div>
            </Transition>
        </div>
</template>
<script setup lang="ts">
import {ref} from "vue";

    const textoPopUp = ref("");
    const popupAtivo = ref(false);

    const exibirPopUp = ((mensagem:string) => {
        textoPopUp.value = mensagem;
        popupAtivo.value = true;

        setTimeout(()=> {
            popupAtivo.value = false
        },3000)

    })
defineExpose({
    exibirPopUp
})
</script>
<style lang="scss" scoped>
@use "../components-scss/variaveis.scss";

    .container-popup{
        display: flex;
        justify-content: center;
        .popoup-aviso{
            display: flex;
            color: #fff;
            justify-content: center;
            align-items: center;
            background-color: black;
            height: 50px;
            z-index: 9000;
            position: fixed;
            bottom: 30px;
            width: 20%;
            border-radius: 10px;
            font-size: variaveis.$font-size-sm;
            @include variaveis.fontePadraoSite;
        }
    }

    .slide-enter-active,
    .slide-leave-active {
        transition: all 0.4s ease;
    }


    .slide-enter-from,
    .slide-leave-to {
        transform: translateY(-50px); 
        opacity: 0;                   
    }

</style>