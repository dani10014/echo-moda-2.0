import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
    clientId: '1060511364514-v5asur2fatndfhmihtgdmgl7bd63shpj.apps.googleusercontent.com'
})

app.mount('#app')
