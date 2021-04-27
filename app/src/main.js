import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/scss/style.scss";

import Vue from 'vue'
import App from './App.vue'
import i18n from "./plugins/i18n";
import router from './plugins/router'
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

new Vue({
  i18n,
  router,
  render: h => h(App)
}).$mount('#app')
