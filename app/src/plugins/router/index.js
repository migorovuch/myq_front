import Vue from 'vue'
import VueRouter from 'vue-router'
import BaseLayout from "@/views/layouts/main/BaseLayout";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home', name: 'root', component: BaseLayout, children: [
      {path: '/home', name: 'home', component: () => import('../../views/views/Home.vue')},
      {path: '/about', name: 'about', component: () => import('../../views/views/About.vue')},
      {path: '/company', name: 'company', component: () => import('../../views/views/company/CompanySettings')},
      {path: '/company/bookings', name: 'company_bookings', component: () => import('../../views/views/company/Bookings')}
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
