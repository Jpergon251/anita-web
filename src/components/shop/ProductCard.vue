<template>
    <article class="product-card">

        <img
            :src="product.image"
            :alt="product.name"
            class="product-image"
        >

        <div class="product-info">

            <h3>{{ product.name }}</h3>

            <p class="product-price">
                ${{ product.price }}
            </p>

            <button>
                Ver producto
            </button>

        </div>

    </article>
</template>

<script setup>
defineProps({
    product: {
        type: Object,
        required: true
    }
});
</script>