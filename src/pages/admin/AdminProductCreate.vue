<template>
    <section class="admin-page">
        <h1>Nuevo producto</h1>
        <ProductForm :categories="categories" @saved="$router.push('/admin/products')" />
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ProductForm from '../../components/admin/ProductForm.vue'
import { getCategories } from '../../services/categories'

const categories = ref([])

onMounted(async () => {
    const { data } = await getCategories()
    categories.value = data || []
})
</script>
