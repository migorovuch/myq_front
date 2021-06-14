import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import "./assets/scss/style.scss";

import Vue from 'vue'
import App from './App.vue'
import i18n from "./plugins/i18n";
import router from './plugins/router'
import store from './store/store';
import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Date.prototype.timestamp = function() {
  return this.valueOf() / 1000;
};
Date.prototype.toFormatString = function() {
  var
      month = '' + (this.getMonth() + 1),
      day = '' + this.getDate(),
      year = this.getFullYear(),
      hours = this.getHours(),
      minutes = this.getMinutes(),
      seconds = this.getSeconds();

  if (month.length < 2) {
    month = '0' + month;
  }
  if (day.length < 2) {
    day = '0' + day;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
