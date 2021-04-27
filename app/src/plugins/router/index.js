import Vue from 'vue'
import VueRouter from 'vue-router'
import BaseLayout from "@/views/layouts/main/BaseLayout";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home', name: 'root', component: BaseLayout, children: [
      {path: '/home', name: 'home', component: () => import('../../views/views/Home.vue')},
      {path: '/about', name: 'about', component: () => import('../../views/views/About.vue')}
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
