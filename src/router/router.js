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
import { JwtDecode } from '@/lib/util'

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
    component: BoardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/board/:uid/task',
    name: 'task',
    component: TaskView,
    meta: { requiresAuth: true },
    children: [
      {
        path: ':id',
        name: 'taskDetail',
        component: TaskDetail
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
    meta: { requiresAuth: true },
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
    redirect: '/login'
  }
]
const router = createRouter({
  history: createWebHistory('/kw1/'),
  routes
})

function isTokenValid(token) {
  if (!token) return false
  try {
    const decodedToken = JwtDecode(token)
    const currentTime = Date.now() / 1000 // Current time in seconds
    return decodedToken.exp > currentTime
  } catch (error) {
    return false
  }
}

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token') // Assuming token is stored in localStorage
  const isAuthenticated = isTokenValid(token)

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isAuthenticated) {
      next(); // Redirect to login if not authenticated
    } else {
      next("/login"); // Proceed to the route
    }
  } else {
    next() // If the route doesn't require authentication, always allow
  }
})

export default router
