import { createApp } from 'vue'
import router from './router/router.js'
import store from './store/store.js'
import App from './App.vue'

import './assets/common.css'
import './assets/weui.min.css'
import './assets/animate.css'



const app = createApp(App)


app.use(store)
app.use(router)
app.mount('#app')
