import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import AboutView from '@/views/AboutView.vue'
import TaskDetail from '@/views/TaskDetail.vue'

const routes = [
  {
    path: '',
    name: 'home',
    redirect: '/task'
  },
  {
    path: '/task',
    name: 'task',
    component: TaskView,
    children: [
      {
        path: ':id',
        component: TaskDetail
      }
    ]
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  }
]
//import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
