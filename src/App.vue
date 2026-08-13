<template>
    <Header v-if="!isAdminRoute" @toggle-menu="menuOpen = !menuOpen" />

    <Transition name="slide">
        <Subheader v-if="!isAdminRoute" v-show="menuOpen" />
    </Transition>

    <main>
        <RouterView />
    </main>

    <Footer v-if="!isAdminRoute" />

</template>

<script setup>
import { computed, ref } from 'vue'

import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import Subheader from './components/Subheader.vue'
import { useRoute } from 'vue-router'

const menuOpen = ref(false)
const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))


</script>
