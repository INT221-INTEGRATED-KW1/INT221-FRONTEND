import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import TaskDetail from '@/views/TaskDetail.vue'
import TaskEdit from '@/views/TaskEdit.vue'
import TaskCreate from '@/views/TaskCreate.vue'
import StatusManager from '@/views/StatusManager.vue'
import StatusAdd from '@/views/StatusAdd.vue'
import StatusEdit from '@/views/StatusEdit.vue'

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
        name: 'addTask',
        component: TaskCreate
      },
      {
        path: ':id/edit',
        name: 'editTask',
        component: TaskEdit
      }
    ]
  },
  {
    path: '/status',
    name: 'status',
    component: StatusManager,
    children: [
      {
        path: 'add',
        name: 'addStatus',
        component: StatusAdd
      },
      {
        path: ':id/edit',
        name: 'editStatus',
        component: StatusEdit
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
