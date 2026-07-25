import { createApp } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)
app.mount('#app')

AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  offset: 60,
  once: true,
})
