import { createRouter, createWebHistory } from 'vue-router'
import HomeView          from '../views/HomeView.vue'
import LibraryView       from '../views/LibraryView.vue'
import SearchResultView  from '../views/SearchResultView.vue'
import SettingsView      from '../views/SettingsView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import LoginView         from '../views/LoginView.vue'
import RegisterView      from '../views/RegisterView.vue'
import AccountView       from '../views/AccountView.vue'
import VerifyEmailView   from '../views/VerifyEmailView.vue'

const routes = [
    { path: '/',              name: 'home',         component: HomeView },
    { path: '/library',       name: 'library',      component: LibraryView },
    { path: '/search',        name: 'search',       component: SearchResultView },
    { path: '/settings',      name: 'settings',     component: SettingsView },
    { path: '/article/:id',   name: 'article',      component: ArticleDetailView },
    { path: '/verify-email',  name: 'verifyEmail',  component: VerifyEmailView },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { guestOnly: true }
    },
    {
        path: '/account',
        name: 'account',
        component: AccountView,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

router.beforeEach((to) => {
    const raw        = localStorage.getItem('sb-' + import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token')
    const isLoggedIn = !!raw

    if (to.meta.requiresAuth && !isLoggedIn) return { name: 'login' }
    if (to.meta.guestOnly   && isLoggedIn)   return { name: 'home' }
})

export default router