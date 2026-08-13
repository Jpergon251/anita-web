<template>
    <section class="categories">

        <div class="section-heading">

            <span class="eyebrow">
                Descubre
            </span>

            <h2>
                Nuestras categorías
            </h2>

            <p>
                Encuentra productos creados para organizar,
                regalar y disfrutar de cada detalle.
            </p>

        </div>


        <div v-if="categories.length" class="categories-grid">

            <RouterLink v-for="category in categories" :key="category.id" :to="{
                name: 'category',
                params: {
                    slug: category.slug
                }
            }" class="category-card">
                <span class="category-name">
                    {{ category.name }}
                </span>

                <span class="category-arrow" aria-hidden="true">
                    →
                </span>

            </RouterLink>

        </div>


        <div v-else-if="loading" class="categories-loading" aria-label="Cargando categorías">
            <span></span>
            <span></span>
            <span></span>
        </div>


        <p v-else class="empty-state">
            Próximamente encontrarás nuestras categorías.
        </p>

    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getCategories } from '../../services/categories'

const categories = ref([])
const loading = ref(true)

onMounted(async () => {
    try {
        const { data } = await getCategories()

        categories.value = data || []
    } finally {
        loading.value = false
    }
})
</script>