<template>
    <header class="header">


        <form class="search" @submit.prevent="searchProducts">
            <input
                v-model="search"
                type="search"
                placeholder="Buscar productos..."
                aria-label="Buscar productos"
            >
        </form>

        <Logo />

        <section class="actions">
            <button>
                <Heart class="icon" />
            </button>

            <button>
                <ShoppingBag class="icon" />
            </button>

            <button @click="$emit('toggle-menu')">
                ☰
            </button>
        </section>

    </header>

</template>
<script setup>
import { ref,computed, watch } from "vue";
import { Heart, ShoppingBag } from "lucide-vue-next";
import Logo from "./Logo.vue";
import { useRouter, useRoute } from "vue-router";

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
