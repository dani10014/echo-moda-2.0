<template>
    <h2>Nova senha</h2>
    <input v-model="senha" type="password" placeholder="Nova senha">
    <input v-model="confirmacao" type="password" placeholder="Confirme a nova senha">
    <span v-if="erro">As senhas devem ser iguais e ter no mínimo 8 caracteres</span>
    <div class="botao-acessar">
        <button class="btn-acessar" @click="salvarSenha">Salvar senha</button>
    </div>
    <popup ref="popupRef" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import popup from "./popup.vue";

const emit = defineEmits(["senhaAlterada"]);
const senha = ref("");
const confirmacao = ref("");
const erro = ref(false);
const popupRef = ref<any>(null);

const salvarSenha = async () => {
    erro.value = senha.value.length < 8 || senha.value !== confirmacao.value;
    if (erro.value) return;

    try {
        const resposta = await fetch("https://echo-moda-2-0.onrender.com/api/nova-senha", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ senha: senha.value })
        });

        if (!resposta.ok) throw new Error("Falha ao alterar senha");
        popupRef.value?.exibirPopUp("Senha alterada com sucesso");
        setTimeout(() => emit("senhaAlterada"), 500);
    } catch {
        popupRef.value?.exibirPopUp("Código expirado ou erro no servidor");
    }
};
</script>

<style lang="scss" scoped>
@use "../components-scss/variaveis.scss";
h2 { text-align: center; @include variaveis.fontePadraoSite; }
input { padding: variaveis.$space-md; border: none; border-radius: 5px; outline: none; margin-bottom: variaveis.$space-sm; }
span { color: red; font-size: variaveis.$font-size-xs; }
.botao-acessar { display: flex; justify-content: center; margin-top: variaveis.$space-xl; button { width: 50%; @include variaveis.padraoBotao; } }
</style>