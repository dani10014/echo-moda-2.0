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

    const callback = (response: GoogleCallbackResponse) => {
        console.log('Login efetuado com sucesso:', response)
        console.log('Token JWT para validação:', response.credential)
    }

</script>

<style lang="scss" scoped>

</style>
