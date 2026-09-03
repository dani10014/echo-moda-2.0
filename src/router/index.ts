import { createRouter, createWebHistory } from 'vue-router'

import HomeViwe from "../pages/home-view.vue";
import LoginView from "../pages/login.vue";

const routes = [
  {
    path:"/",
    name:"Home",
    component:HomeViwe,
  },
  {
    path:"/login",
    name:"Login",
    component:LoginView,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
