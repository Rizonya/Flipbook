import Vue from "vue";

import App from "./App.vue";
import router from "./router";
import { FlippingWidgets } from "vue-turnjs";
import "vue-turnjs/dist/vue-turnjs.esm.css";
import "./assets/main.css";
import { createPinia } from 'pinia'
import { useUserStore } from './store/index.js'
const pinia = createPinia()
Vue.use(pinia);

Vue.use(FlippingWidgets);
new Vue({
  router,
  pinia,
  provide: {
    userStore: useUserStore
  },
  render: (h) => h(App),
}).$mount("#app");
