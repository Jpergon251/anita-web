<template>
    <form class="product-filters" @submit.prevent="$emit('apply')">
        <label>
            Categoría
            <select :value="filters.categoryId" @change="update('categoryId', $event.target.value)">
                <option value="">Todas</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
            </select>
        </label>
        <label>Precio mínimo<input type="number" min="0" :value="filters.minPrice" @input="update('minPrice', $event.target.value)"></label>
        <label>Precio máximo<input type="number" min="0" :value="filters.maxPrice" @input="update('maxPrice', $event.target.value)"></label>
        <label>
            Disponibilidad
            <select :value="filters.availability" @change="update('availability', $event.target.value)">
                <option value="">Cualquiera</option>
                <option value="in-stock">En stock</option>
                <option value="out-of-stock">Agotado</option>
            </select>
        </label>
        <button type="submit">Aplicar</button>
        <button type="button" class="link-button" @click="$emit('clear')">Limpiar</button>
    </form>
</template>

<script setup>
defineProps({
    filters: { type: Object, required: true },
    categories: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:filters', 'apply', 'clear'])

function update(key, value) {
    emit('update:filters', { key, value })
}
</script>
