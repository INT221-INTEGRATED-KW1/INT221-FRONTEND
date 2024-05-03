import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import routers from './router/router.js'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(routers)
app.mount('#app')
