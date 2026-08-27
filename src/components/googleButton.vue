<template>
    <GoogleLogin 
        :callback="callback"
        theme="filled_blue" 
        size="large"
        text="signin_with"
        shape="rectangular"
    />
</template>

<script setup lang="ts">
    import { GoogleLogin } from 'vue3-google-login'

    const resultado = defineEmits(["sucesso","erro"])

    interface GoogleCallbackResponse {
        credential: string
    }

    const callback = async (response: GoogleCallbackResponse) => {
        console.log('Login efetuado com sucesso:', response)

        if(response.credential){
            try{
                const resultValidacao = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-google",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        token:response.credential,
                    })
                })
                
                const dados = await resultValidacao.json()

                if(resultValidacao.status === 200){
                    resultado("sucesso",{token:dados.token});
                }
                if(resultValidacao.status === 400){
                    resultado("erro",{mensagem:"Ocorreu um erro ao logar"});
                }

            }catch(erro){
                resultado("erro",{mensagem:"Erro com o servidor"});
            }
    }
}

</script>

<style lang="scss" scoped>

</style>
