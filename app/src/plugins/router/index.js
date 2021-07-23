import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from "../i18n";
import BaseLayout from "@/views/layouts/main/BaseLayout";
import authMiddleware from "./authMiddleware";
import middlewarePipeline from "./middlewarePipeline";
import store from "../../store/store";
import myCompanyMiddleware from "./myCompanyMiddleware";
import approveEmailMiddleware from "./approveEmailMiddleware";

Vue.use(VueRouter)

let supportedLocales = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',');

const routes = [
  {
    path: '/:locale(' + supportedLocales.join('|')+')', name: 'root', component: BaseLayout, children: [
      {path: '', name: 'home', component: () => import('../../views/views/Home.vue')},
      {path: 'about', name: 'about', component: () => import('../../views/views/About.vue')},
      {path: 'my_company', name: 'my_company', meta: {middleware: [myCompanyMiddleware]}},
      {path: 'reset-password/:token', component: () => import('../../views/views/Home.vue'), name: 'reset-password'},
      {
        path: 'approve-email/:id/:token',
        component: () => import('../../views/views/Home.vue'),
        name: 'approve-email',
        meta: {
          middleware: [
            approveEmailMiddleware
          ]
        }
      },
      {
        path: 'company',
        name: 'company',
        component: () => import('../../views/views/company/CompanySettings'),
        meta: {
          middleware: [
            authMiddleware
          ]
        }
      },
      {
        path: 'company/bookings', name: 'company_bookings', component: () => import('../../views/views/booking/CompanyBookings'),
        meta: {
          middleware: [
            authMiddleware
          ]
        }
      },
      {
        path: 'company/clients', name: 'company_clients', component: () => import('../../views/views/client/ClientsList'),
        meta: {
          middleware: [
            authMiddleware
          ]
        }
      },
      {path: 'bookings', name: 'my_bookings', component: () => import('../../views/views/booking/MyBookings')},
      {path: 'company/schedule', name: 'company_schedule', component: () => import('../../views/views/schedule/ScheduleList')},
      {path: 'company/schedule/:id', name: 'company_schedule_item', component: () => import('../../views/views/schedule/ScheduleForm'),meta: {
          middleware: [
            authMiddleware
          ]
        }},
      {path: 'q/:id', name: 'schedule_vue', component: () => import('../../views/views/schedule/ScheduleView')},
      {path: 'company/:id', name: 'company_vue', component: () => import('../../views/views/company/CompanyView')},
    ]
  }
];

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
});
router.beforeEach(
    async (to, from, next) => {
      // Set locale based on url
      if (!to.params.locale && from.params.locale) {
        i18n.locale = from.params.locale;
      } else if (!to.params.locale && supportedLocales.includes(navigator.language)) {
        i18n.locale = navigator.language;
      } else if (to.params.locale) {
        i18n.locale = to.params.locale;
      }
      // Redirect to locale url based on from
      if (
          i18n.locale
          && !to.params.locale
      ) {
        try {
          await router.push({'path': '/' + i18n.locale + to.fullPath})
        } catch (error) {
          if (error.name === 'NavigationDuplicated') {
            // Do nothing
          } else {
            throw error;
          }
        }
        return;
      }

      next();
    }
)

export default router;
