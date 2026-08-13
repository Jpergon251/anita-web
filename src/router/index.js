import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import ShopPage from '../pages/ShopPage.vue'
import AboutPage from '../pages/AboutPage.vue'
import FaqPage from '../pages/FaqPage.vue'
import ContactPage from '../pages/ContactPage.vue'
import ProductPage from '../pages/ProductPage.vue'
import CategoryPage from '../pages/CategoryPage.vue'
import AdminLayout from '../components/admin/AdminLayout.vue'
import AdminLogin from '../pages/admin/AdminLogin.vue'
import AdminDashboard from '../pages/admin/AdminDashboard.vue'
import AdminProducts from '../pages/admin/AdminProducts.vue'
import AdminProductCreate from '../pages/admin/AdminProductCreate.vue'
import AdminProductEdit from '../pages/admin/AdminProductEdit.vue'
import AdminCategories from '../pages/admin/AdminCategories.vue'
import AdminForbidden from '../pages/admin/AdminForbidden.vue'
import AdminPasswordReset from '../pages/admin/AdminPasswordReset.vue'
import { useAuth } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/shop',
            name: 'shop',
            component: ShopPage
        },
        { path: '/tienda', redirect: '/shop' },
        { path: '/shop/search', name: 'search', component: ShopPage },
        { path: '/shop/category/:slug', name: 'category', component: CategoryPage },
        { path: '/shop/:slug', name: 'product', component: ProductPage },
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
            
        },
        { path: '/admin/login', name: 'admin-login', component: AdminLogin },
        { path: '/admin/reset-password', name: 'admin-reset-password', component: AdminPasswordReset },
        { path: '/admin/forbidden', name: 'admin-forbidden', component: AdminForbidden },
        { path: '/admin', component: AdminLayout, meta: { requiresAuth: true, requiresAdmin: true }, children: [
            { path: '', name: 'admin', component: AdminDashboard },
            { path: 'products', name: 'admin-products', component: AdminProducts },
            { path: 'products/new', name: 'admin-product-new', component: AdminProductCreate },
            { path: 'products/:id/edit', name: 'admin-product-edit', component: AdminProductEdit },
            { path: 'categories', name: 'admin-categories', component: AdminCategories }
        ] },
        { path: '/:pathMatch(.*)*', redirect: '/shop' }
    ]
})

router.beforeEach(async to => {
    const auth = useAuth()
    await auth.initialize()
    if (to.name === 'admin-login' && auth.isAuthenticated.value && auth.isAdmin.value) return '/admin'
    if (!to.matched.some(record => record.meta.requiresAuth)) return true
    if (!auth.isAuthenticated.value) return { name: 'admin-login', query: { redirect: to.fullPath } }
    if (to.matched.some(record => record.meta.requiresAdmin) && !auth.isAdmin.value) return { name: 'admin-forbidden' }
    return true
})

export default router
