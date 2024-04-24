import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import routers from './router/router.js'

const app = createApp(App)

app.use(routers)

app.mount('#app')
