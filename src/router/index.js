import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import ShopPage from '../pages/ShopPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import FaqPage from '../pages/FaqPage.vue'
import ContactPage from '../pages/ContactPage.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/tienda',
            name: 'shop',
            component: ShopPage
        },
        {
            path: '/sobre-mi',
            name: 'sobre-mi',
            component: AboutPage
        },
        {
            path: '/faq',
            name: 'faq',
            component: FaqPage
        },
        {
            path: '/contacto',
            name: 'contacto',
            component: ContactPage
            
        }
    ]
})

export default router