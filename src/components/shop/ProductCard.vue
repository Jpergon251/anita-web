<template>
    <article class="product-card">
        <RouterLink :to="{ name: 'product', params: { slug: product.slug } }" class="product-image">
            <img v-if="product.image_url" :src="product.image_url" :alt="product.name">
            <span v-else class="product-placeholder" aria-label="Producto sin imagen">
                <PackageOpen :size="42" aria-hidden="true" />
            </span>
        </RouterLink>

        <div class="product-info">

            <p v-if="product.categories" class="product-category">{{ product.categories.name }}</p>
            <h3><RouterLink :to="{ name: 'product', params: { slug: product.slug } }">{{ product.name }}</RouterLink></h3>

            <p class="product-price">
                {{ formattedPrice }}
            </p>
            <p class="stock" :class="stockClass">{{ stockLabel }}</p>
            <RouterLink :to="{ name: 'product', params: { slug: product.slug } }" class="product-button">Ver producto</RouterLink>

        </div>

    </article>
</template>

<script setup>
import { computed } from 'vue'
import { PackageOpen } from 'lucide-vue-next'
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});
const formattedPrice = computed(() => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(props.product.price || 0))
const stockLabel = computed(() => props.product.stock <= 0 ? 'Agotado' : props.product.stock <= 5 ? 'Poco stock' : 'En stock')
const stockClass = computed(() => props.product.stock <= 0 ? 'out' : props.product.stock <= 5 ? 'low' : 'available')
</script>
