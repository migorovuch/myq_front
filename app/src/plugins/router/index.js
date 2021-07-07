import Vue from 'vue'
import VueRouter from 'vue-router'
import BaseLayout from "@/views/layouts/main/BaseLayout";
import authMiddleware from "./authMiddleware";
import middlewarePipeline from "./middlewarePipeline";
import store from "../../store/store";
import companyMiddleware from "./companyMiddleware";

Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/home', name: 'root', component: BaseLayout, children: [
      {path: '/home', name: 'home', component: () => import('../../views/views/Home.vue')},
      {path: '/about', name: 'about', component: () => import('../../views/views/About.vue')},
      {path: '/my_company', name: 'my_company', meta: {middleware: [companyMiddleware]}},
      {
        path: '/company',
        name: 'company',
        component: () => import('../../views/views/company/CompanySettings'),
        meta: {
          middleware: [
            authMiddleware
          ]
        }
      },
      {path: '/company/bookings', name: 'company_bookings', component: () => import('../../views/views/booking/CompanyBookings'),
        meta: {
          middleware: [
            authMiddleware
          ]
        }},
      {path: '/bookings', name: 'my_bookings', component: () => import('../../views/views/booking/MyBookings')},
      {path: '/company/schedule', name: 'company_schedule', component: () => import('../../views/views/schedule/ScheduleList')},
      {path: '/company/schedule/:id', name: 'company_schedule_item', component: () => import('../../views/views/schedule/ScheduleForm'),meta: {
          middleware: [
            authMiddleware
          ]
        }},
      {path: '/q/:id', name: 'schedule_vue', component: () => import('../../views/views/schedule/ScheduleView')},
      {path: '/company/:id', name: 'company_vue', component: () => import('../../views/views/company/CompanyView')},
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) {
    return next()
  }
  const middleware = to.meta.middleware
  const context = {
    to,
    from,
    next,
    store
  }
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  })
})

export default router;
