<template>
    <Header @toggle-menu="menuOpen = !menuOpen"/>

    <Transition name="slide">
        <Subheader v-show="menuOpen" />
    </Transition>

    <main>
        <RouterView/>
    </main>

    <Footer/>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView} from 'vue-router';
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
import Subheader from './components/Subheader.vue';
const menuOpen = ref(false)
</script>