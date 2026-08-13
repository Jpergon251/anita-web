<template>
    <section class="product-grid">

        <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
        />

    </section>
</template>

<script setup>
import ProductCard from "./ProductCard.vue";

defineProps({
    products: {
        type: Array,
        required: true
    }
});
</script>
