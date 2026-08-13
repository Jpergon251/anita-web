<template>
    <div class="admin-layout">
        <aside>
            <RouterLink to="/admin" class="admin-brand">Administración</RouterLink>

            <nav>
                <RouterLink to="/admin">Resumen</RouterLink>
                <RouterLink to="/admin/products">Productos</RouterLink>
                <RouterLink to="/admin/categories">Categorías</RouterLink>
            </nav>

            <button @click="signOut">Cerrar sesión</button>
        </aside>

        <main class="admin-main">
            <RouterView />
        </main>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'

const router = useRouter()
const { logout } = useAuth()

async function signOut() {
    await logout()
    router.push('/admin/login')
}
</script>
