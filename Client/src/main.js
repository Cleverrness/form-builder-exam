import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueAxios from "vue-axios";
import axios from "axios";
import VueRouter from "vue-router";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import {
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  SpinnerPlugin,
  ModalPlugin,
  TablePlugin,
  PopoverPlugin,
} from "bootstrap-vue";
[
  FormGroupPlugin,
  FormPlugin,
  FormInputPlugin,
  ButtonPlugin,
  FormSelectPlugin,
  AlertPlugin,
  ToastPlugin,
  SpinnerPlugin,
  ModalPlugin,
  TablePlugin,
  PopoverPlugin,
].forEach((x) => Vue.use(x));

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

const shared_data = {
  baseUrl: "https://heroku-form-builder.herokuapp.com/"
  // baseUrl: "http://localhost:3000/"
}


new Vue({
  router,
  data() {
    return {
      store: shared_data
    }
  },
  render: h => h(App)
}).$mount('#app')
