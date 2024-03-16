import Vue from "vue";
import VueRouter from "vue-router";
import ReaderView from "../views/reader/ReaderView.vue";
import Login from '../views/Login.vue';
import NotFound from '../views/NotFound.vue';
import UserPage from '../views/UserPage.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: import.meta.env.BASE_URL,
  routes: [
    // Home route
    {
      path: "/",
      name: "home",
      component: NotFound
    },
    //User route
    {
      path: "/user",
      component:UserPage
    },
    // Login route
    {
      path: "/login",
      name: "login",
      component: Login
    },
    // Reader route
    {
      path: "/reader/:name",
      name: "reader",
      component: ReaderView,
    },
    // Not Found route
    {
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: NotFound 
    }
  ],
});

export default router;
