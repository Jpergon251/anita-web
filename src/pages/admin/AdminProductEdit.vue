<template>
    <section class="admin-page product-editor-page">
        <h1>Editar producto</h1>
        <p v-if="loading">Cargando producto…</p>
        <div v-else-if="product" class="admin-form-modal product-form-modal" role="dialog" aria-modal="true" aria-labelledby="product-edit-title">
            <div class="product-form-modal__content">
                <h2 id="product-edit-title">Editar producto</h2>
                <ProductForm :product="product" :categories="categories" @saved="$router.push('/admin/products')" />
            </div>
        </div>
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
