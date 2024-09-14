import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import TaskDetail from '@/components/taskcomponent/TaskDetail.vue'
import TaskEdit from '@/components/taskcomponent/TaskEdit.vue'
import TaskCreate from '@/components/taskcomponent/TaskCreate.vue'
import StatusManager from '@/views/StatusManager.vue'
import StatusAdd from '@/components/statuscomponent/StatusAdd.vue'
import StatusEdit from '@/components/statuscomponent/StatusEdit.vue'
import StatusDelete from '@/components/statuscomponent/StatusDelete.vue'
import LimitModal from '@/components/LimitModal.vue'
import LoginView from '@/views/LoginView.vue'
import BoardView from '@/views/BoardView.vue'

const routes = [
  {
    path: '',
    name: 'home',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/board',
    name: 'board',
    component: BoardView
  },
  {
    path: '/board/:uid/task',
    name: 'task',
    component: TaskView,
    children: [
      {
        path: ':id',
        name: 'taskDetail',
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
      },
      {
        path: 'limit',
        name: 'limitStatus',
        component: LimitModal
      }
    ]
  },
  {
    path: '/board/:uid/status',
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
      {
        path: ':id/delete',
        name: 'deleteStatus',
        component: StatusDelete
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/task'
  }
]
const router = createRouter({
  history: createWebHistory('/kw1/'),
  routes
})

router.beforeEach(async (to, from, next) => {
  const getLogin = localStorage.getItem('username')
  if ((getLogin === null || getLogin.length === 0) && to.name !== 'login') {
    return next({ name: 'login' })
  }
  next()
})

export default router
