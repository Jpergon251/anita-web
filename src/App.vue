<template>
    <Header
        v-if="!isAdminRoute"
        :menu-open="menuOpen"
        @toggle-menu="toggleMenu"
    />

    <Transition name="slide">
        <Subheader
            v-if="!isAdminRoute"
            v-show="menuOpen"
        />
    </Transition>

    <main class="app-content">
        <RouterView />
    </main>

    <Footer v-if="!isAdminRoute" />
</template>

<script setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Subheader from './components/Subheader.vue'

const menuOpen = ref(false)

const route = useRoute()

const isAdminRoute = computed(() =>
    route.path.startsWith('/admin')
)

function toggleMenu() {
    menuOpen.value = !menuOpen.value
}
</script>