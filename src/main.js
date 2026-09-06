import { createApp } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { captureLeadAttribution } from './composables/useLeadAttribution'
import { initAnalytics } from './composables/useAnalytics'

captureLeadAttribution()
initAnalytics()

const app = createApp(App)

app.use(router)
app.mount('#app')

AOS.init({
  duration: 800,
  easing: 'ease-out-cubic',
  offset: 40,
  once: true,
  mirror: false,
  anchorPlacement: 'top-bottom',
  disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
})

// First paint after mount
window.requestAnimationFrame(() => AOS.refresh())
