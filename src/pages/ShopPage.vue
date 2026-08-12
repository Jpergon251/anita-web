<template>
    <main class="shop-page">

        <ProductGrid
            :products="filteredProducts"
        />

    </main>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import ProductGrid from "../components/shop/ProductGrid.vue";

const route = useRoute();

const products = [
    {
        id: 1,
        name: "Agenda Floral",
        price: 12000
    },
    {
        id: 2,
        name: "Cuaderno A5",
        price: 8500
    }
];

const search = computed(() => route.query.q ?? "");

const filteredProducts = computed(() =>
    products.filter(product =>
        product.name
            .toLowerCase()
            .includes(search.value.toLowerCase())
    )
);
</script>