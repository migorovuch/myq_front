import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/scss/style.scss";
import "./assets/css/flags-sprite.css";

import Vue from 'vue'
import App from './App.vue'
import i18n from "./plugins/i18n";
import router from './plugins/router'
import './plugins/dateFormat'
import store from './store/store';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

import VueTelInput from 'vue-tel-input';
import 'vue-tel-input/dist/vue-tel-input.css';

String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(VueTelInput);

import { cilList, cilBell, cilEnvelopeOpen } from '@coreui/icons'

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
  icons: {cilList, cilBell, cilEnvelopeOpen}
}).$mount('#app')
