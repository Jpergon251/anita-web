<template>
    <section class="admin-page product-editor-page">
        <h1>Nuevo producto</h1>
        <div class="admin-form-modal product-form-modal" role="dialog" aria-modal="true" aria-labelledby="product-create-title">
            <div class="product-form-modal__content">
                <h2 id="product-create-title">Nuevo producto</h2>
                <ProductForm :categories="categories" @saved="$router.push('/admin/products')" />
            </div>
        </div>
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
