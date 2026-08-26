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

    interface GoogleCallbackResponse {
        credential: string
    }

    const callback = async (response: GoogleCallbackResponse) => {
        console.log('Login efetuado com sucesso:', response)

        if(response){
            try{
                const resultValidacao = await fetch("https://echo-moda-2-0.onrender.com/api/verificar-google",{
                    method:"Post",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify({
                        token:response.credential,
                    })
                })
                
                if(resultValidacao.status === 200){
                    alert("Verificado! proseguindo")
                }

            }catch(erro){
            
            }
    }
}

</script>

<style lang="scss" scoped>

</style>
