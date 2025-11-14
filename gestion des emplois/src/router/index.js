import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import AddJob from '../pages/AddJob.vue'
import EditJob from '../pages/EditJob.vue'

const routes = [
  { path: '/',name : 'Home' , component: Home },
  { path: '/add',name: 'AddJob', component: AddJob , props: true},
  { path: '/jobs/:id',name : 'EditJob', component: EditJob }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router