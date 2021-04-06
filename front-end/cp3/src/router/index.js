import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import University from '../views/University.vue'
import Course from '../views/Course.vue';
import Admin from '../views/Admin.vue';
import Login from "../views/Login.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/university/:id',
    name: 'University',
    component: University
  },
  {
    path: '/course/:uni_id/:course_id',
    name: 'Course',
    component: Course
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
