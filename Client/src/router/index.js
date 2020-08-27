import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/NewForm',
    name: 'New Form Page',
    component: () => import('../views/NewFormPage.vue')
  },
  {
    path: '/Submissions',
    name: 'Submissions Page',
    component: () => import('../views/Submissions.vue')
  },
  {
    path: '/Submissions/:formId',
    name: 'Submission Page',
    component: () => import('../views/Submissions.vue')
  },
  {
    path: "*",
    name: "notFound",
    component: () => import('../views/NotFoundPage.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
