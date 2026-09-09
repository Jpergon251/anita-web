<template>
    <main class="home">

        <Hero />
        <Categories/>
        <!-- <Featured/> -->
        <Infobanner/>

        <WelcomeModal />

    </main>
</template>

<script setup>
import Categories from '../components/home/Categories.vue';
import Featured from '../components/home/Featured.vue';
import Hero from '../components/home/Hero.vue'
import Infobanner from '../components/home/Infobanner.vue';
import WelcomeModal from '../components/ui/WelcomeModal.vue';
</script>