<template>
    <div class="search-bar">

        <input
            v-model="search"
            type="text"
            placeholder="Buscar productos..."
        >

    </div>
</template>

<script setup>
import { ref, watch } from "vue";

const emit = defineEmits(["update:search"]);

const search = ref("");

watch(search, value => {
    emit("update:search", value);
});
</script>