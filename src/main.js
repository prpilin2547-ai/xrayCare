import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import common from './js/Commonfunction'

const app = createApp(App)
app.use(router)
app.config.globalProperties.$common = common
app.mount('#app')