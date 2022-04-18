import Vue from 'vue';
import VueRouter from 'vue-router';
import LoGin from "@/views/LoGin";
import HomePage from "@/views/HomePage";


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'LoGin',
    component: LoGin,
    hidden: true,
  },
  {
    path: '/homepage',
    name: 'HomePage',
    component: HomePage,
  },
]

const router = new VueRouter({
  routes
})

export default router
