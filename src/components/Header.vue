<template>
    <header class="header">


        <div class="search">
            <input
                v-model="search"
                type="search"
                placeholder="Buscar productos..."
                @keyup.enter="searchProducts"
            >
        </div>

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
        name: "shop",
        query: {
            q: search.value
        }
    });
}
</script>