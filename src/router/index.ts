import { createRouter, createWebHistory } from 'vue-router'

import HomeViwe from "../components/home-view.vue";
import LoginView from "../components/login.vue";

const routes = [
  {
    path:"/",
    name:"Home",
    component:HomeViwe
  },
  {
    path:"/login",
    name:"Login",
    component:LoginView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
