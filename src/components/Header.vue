<template>
    <header class="header">

        <form class="search" @submit.prevent="searchProducts">
            <input v-model="search" type="search" placeholder="Buscar productos..." aria-label="Buscar productos">
        </form>

        <Logo />

        <section class="actions">
            <button aria-label="Favoritos">
                <Heart class="icon" />
            </button>
            <button class="cart-button" aria-label="Carrito" @click="cartOpen = true">
                <ShoppingBag class="icon" />

                <span v-if="cart.totalItems" class="cart-count">
                    {{ cart.totalItems }}
                </span>
            </button>
        </section>

        <button class="menu-button" :aria-label="menuOpen ? 'Cerrar menú' : 'Abrir menú'" :aria-expanded="menuOpen"
            @click="$emit('toggle-menu')">
            <ArrowBigUp fill="currentColor" :class="['icon', { active: menuOpen }]" />
        </button>

        <CartDrawer :open="cartOpen" @close="cartOpen = false" />

    </header>
</template>
<script setup>
import { ref, watch } from "vue";
import { ArrowBigUp, Heart, ShoppingBag } from "lucide-vue-next";
import Logo from "./Logo.vue";
import CartDrawer from "./CartDrawer.vue";
import { useRouter, useRoute } from "vue-router";
import { useCartStore } from '../stores/cart.js';

const cart = useCartStore()
const cartOpen = ref(false)
defineProps({
    menuOpen: {
        type: Boolean,
        default: false
    }
});

defineEmits(["toggle-menu"]);

const router = useRouter();
const route = useRoute();

const search = ref(route.query.q ?? "");

watch(
    () => route.query.q,
    (value) => {
        search.value = value ?? "";
    }
);

function searchProducts() {
    router.push({
        name: "search",
        query: {
            q: search.value
        }
    });
}
</script>
