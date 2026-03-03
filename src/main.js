import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { getAllArticles } from './services/api.js'

const app = createApp(App)
app.use(router)
app.mount('#app')

// Prefetch library articles in the background so the Bibliothek page loads instantly
getAllArticles().catch(() => {})