import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import TaskDetail from '@/views/TaskDetail.vue'
import TaskEdit from '@/views/TaskEdit.vue'
import TaskCreate from '@/views/TaskCreate.vue'

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
        component: TaskDetail,
      },
      {
        path: 'add',
        name: 'add',
        component: TaskCreate
      },
      {
        path: ':id/edit',
        name: 'edit',
        component: TaskEdit,
      },
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/task'
  }
]
//import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
