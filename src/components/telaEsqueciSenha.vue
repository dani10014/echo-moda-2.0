<template>
    <button class="btn-voltar" @click="mudartela('VoltarAoLoginInicial')"><i class="fa-solid fa-arrow-left"></i></button>
    <h2>Email para recuperação</h2>

    <input type="text" v-model="form.email" placeholder="Email" @keyup="validarEmail">
    <span v-if="resultEmailErro && form.email.length > 0" class="aviso-campo-invalido">Email incorreto</span>
    
    <div class="botao-acessar">
        <button class="btn-acessar" @click="verificarEmail">Prosseguir</button>
    </div>
    <div v-if="dadosCorretos === true" class="container-loading">
        <loading/>
    </div>
    <popup ref="PopupRef" />
</template>
<script setup lang="ts">
    import {ref,reactive} from "vue";
    import loading from "../components/loading.vue";
    import Popup from "../components/popup.vue";

    const form = reactive({
        email:"",
    })

    const mudartela = defineEmits(['VoltarAoLoginInicial']);

    const resultEmailErro = ref(false);
    const regex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dadosCorretos = ref(false);
    const PopupRef = ref<any>(null);

    const validarEmail = () => {
        resultEmailErro.value = !regex.test(form.email);
    }
    
    const verificarEmail = async () => {
        if(resultEmailErro.value === false && form.email.trim().length > 1 && regex.test(form.email)){
                dadosCorretos.value = true;

                try{
                    const resposta = await fetch("https://echo-moda-2-0.onrender.com/api/enviar-codigo",{
                        method:"POST",
                        headers:{"Content-Type":"application/json"},
                        body:JSON.stringify({
                            email:form.email,
                        })
                    })

                    if(resposta.status === 200){
                        alert("Codigo enviado")
                    }
                    if(resposta.status === 400){
                        alert("Erro")
                    }
                }catch(erro){
                        alert("Algo deu errado com o server");
                }finally{
                    dadosCorretos.value = false
                }
            }else{
                PopupRef.value?.exibirPopUp("Dados incorretos");
            }
    }
</script>

<style lang="scss" scoped>
    @use "../components-scss/variaveis.scss";

    h2{
        text-align: center;
        font-size: variaveis.$font-size-xl;
        margin-bottom: variaveis.$space-3xl;
        @include variaveis.fontePadraoSite;
    }
    .aviso-campo-invalido{
        color: red;
        font-size: variaveis.$space-xs;
        margin-bottom:variaveis.$space-sm;
        @include variaveis.fontePadraoSite;
            &::before{
                content: "* ";
            }
    }
    .botao-acessar{
        display: flex;
        justify-content: center;
        width:100%;
        margin-top: variaveis.$space-xl;
        button{
            width: 50%;
                @include variaveis.padraoBotao
            }
    }
    .btn-voltar{
        width: 5%;
        height: 5%;
        cursor: pointer;
        border: none;
        background-color: inherit;
        color: #fff;
        transition: all 0.3s ease-in-out;
        margin-bottom: variaveis.$space-md;
        border-radius: 10px;
        &:hover{
            background-color: #ffffff78;
        }
    }
    input{
        padding: variaveis.$space-md;
        border: none;
        border-radius: 5px;
        outline: none;
        margin-bottom: variaveis.$space-sm;
        transition: all 0.3s ease-in-out;
        &:focus{
            background-color: rgba(201, 201, 201, 0.53);
            color: #fff;
        }
    }
    .container-loading{
        display: flex;
        left: 0;
        top: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.504);
        width: 100%;
        height: 100%;
        position: absolute;
    }
</style>
