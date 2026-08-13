<template>
    <section class="admin-page">
        <h1>Editar producto</h1>
        <p v-if="loading">Cargando producto…</p>
        <ProductForm v-else-if="product" :product="product" :categories="categories" @saved="$router.push('/admin/products')" />
        <p v-else class="error-state">No se encontró el producto.</p>
    </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProductForm from '../../components/admin/ProductForm.vue'
import { getProductById } from '../../services/products'
import { getCategories } from '../../services/categories'

const route = useRoute()
const product = ref(null)
const categories = ref([])
const loading = ref(true)

onMounted(async () => {
    const [item, categoryResult] = await Promise.all([
        getProductById(route.params.id),
        getCategories()
    ])

    product.value = item.data
    categories.value = categoryResult.data || []
    loading.value = false
})
</script>
