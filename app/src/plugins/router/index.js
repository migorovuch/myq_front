import Vue from 'vue'
import VueRouter from 'vue-router'
import i18n from "../i18n";
import BaseLayout from "@/views/layouts/main/BaseLayout";
import authMiddleware from "./authMiddleware";
import middlewarePipeline from "./middlewarePipeline";
import store from "../../store/store";
import myCompanyMiddleware from "./myCompanyMiddleware";
import approveEmailMiddleware from "./approveEmailMiddleware";
import adminMiddleware from "./adminMiddleware";

Vue.use(VueRouter)

let supportedLocales = process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(',');

const routes = [
  {
    path: '/:locale(' + supportedLocales.join('|')+')/dashboard', name: 'dashboard', component: () => import('../../views/layouts/dashboard/TheContainer'), children: [
      {path: '', name: 'dashboard_home', component: () => import('../../views/views/DashboardHome.vue'), meta: {middleware: [adminMiddleware]}},
      {path: 'users', name: 'dashboard_users', component: () => import('../../views/views/user/UsersList.vue'), meta: {middleware: [adminMiddleware]}},
      {path: 'users/:id', name: 'dashboard_user_edit', component: () => import('../../views/views/user/UserEdit'), meta: {middleware: [adminMiddleware]}},
      {path: 'companies', name: 'dashboard_companies', component: () => import('../../views/views/company/DashboardCompanyList'), meta: {middleware: [adminMiddleware]}},
      {path: 'companies/:id', name: 'dashboard_companies_edit', component: () => import('../../views/views/company/DashboardCompanyEdit'), meta: {middleware: [adminMiddleware]}},
      {path: 'schedules', name: 'dashboard_schedules', component: () => import('../../views/views/schedule/DashboardScheduleList'), meta: {middleware: [adminMiddleware]}},
      {path: 'schedules/:id', name: 'dashboard_schedule_edit', component: () => import('../../views/views/schedule/ScheduleForm'), meta: {middleware: [adminMiddleware]}},
      {path: 'bookings', name: 'dashboard_bookings', component: () => import('../../views/views/booking/DashboardBookings'), meta: {middleware: [adminMiddleware]}},
      {path: 'clients', name: 'dashboard_clients', component: () => import('../../views/views/client/DashboardClientsList'), meta: {middleware: [adminMiddleware]}},
    ]
  },
  {
    path: '/:locale(' + supportedLocales.join('|')+')', name: 'root', component: BaseLayout, children: [
      {path: '', name: 'home', component: () => import('../../views/views/Home.vue')},
      {path: 'about', name: 'about', component: () => import('../../views/views/About.vue')},
      {path: 'my_company', name: 'my_company', meta: {middleware: [myCompanyMiddleware]}},
      {path: '/reset-password/:token', component: () => import('../../views/views/Home.vue'), name: 'reset-password'},
      {
        path: '/approve-email/:id/:token',
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
      {path: 'account', name: 'account', component: () => import('../../views/views/auth/AccountForm'), meta: {
          middleware: [
            authMiddleware
          ]
        }}
    ]
  },
  {
    path: '*',
    name:'404',
    component: () => import('../../views/views/404')
  }
];

const router = new VueRouter({
  routes
});

let redirectToLang = (to, from, next) => {
  const newPath = '/' + i18n.locale + to.fullPath;
  const link = router.resolve(newPath);
  // Redirect to locale url based on from
  if (
      i18n.locale &&
      !to.params.locale &&
      link.route.name !== '404'
  ) {
    try {
      return next({'path': newPath})
    } catch (error) {
      if (error.name === 'NavigationDuplicated') {
        // Do nothing, because you are on right page
      } else {
        throw error;
      }
    }
    return;
  }

  return next();
}

router.beforeEach((to, from, next) => {
  // Set locale based on url
  if (!to.params.locale && from.params.locale) {
    i18n.locale = from.params.locale;
  } else if (!to.params.locale && supportedLocales.includes(navigator.language)) {
    i18n.locale = navigator.language;
  } else if (to.params.locale) {
    i18n.locale = to.params.locale;
  }
  if (!to.meta.middleware) {
    return redirectToLang(to, from, next);
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

export default router;
