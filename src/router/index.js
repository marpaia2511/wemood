import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LibraryView from '../views/LibraryView.vue'
import SearchResultView from '../views/SearchResultView.vue'
import SettingsView from '../views/SettingsView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/library',
        name: 'library',
        component: LibraryView
    },
    {
        path: '/search',
        name: 'search',
        component: SearchResultView
    },
    {
        path: '/settings',
        name: 'settings',
        component: SettingsView
    },
    {
        path: '/article/:id',
        name: 'article',
        component: ArticleDetailView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router