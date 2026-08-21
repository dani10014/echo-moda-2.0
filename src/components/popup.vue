<template>
    <div class="popoup-aviso">
        <span>{{ mensagem }}</span>
    </div>
</template>
<script setup lang="ts">

    defineProps({
        mensagem:{
            type:String,
            required:true
        }
    }) 

</script>
<style lang="scss" scoped>
    .popoup-aviso{
        background-color: black;
    }
</style>