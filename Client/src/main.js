import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAxios from "vue-axios";
import axios from "axios";
import VueRouter from "vue-router";
import VueSlideoutPanel from 'vue2-slideout-panel';
import VueSessionStorage from 'vue-sessionstorage'

import Vuelidate from "vuelidate";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormCheckboxPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  SpinnerPlugin,
  DropdownPlugin,
  ModalPlugin,
  AvatarPlugin,
  TablePlugin ,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormCheckboxPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  CardPlugin,
  NavbarPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  LayoutPlugin,
  SpinnerPlugin,
  ModalPlugin,
  DropdownPlugin,
  AvatarPlugin,
  TablePlugin ,
].forEach((x) => Vue.use(x));
Vue.use(Vuelidate);
Vue.use(VueSlideoutPanel);
Vue.use(VueSessionStorage)

axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
Vue.use(VueRouter);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.use(VueAxios, axios);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
