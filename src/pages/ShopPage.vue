<template>
    <main class="shop-page">
        <header class="shop-heading">
            <h1>{{ isSearch ? 'Resultados de búsqueda' : 'Tienda' }}</h1>
            <p v-if="isSearch">{{ products.length }} resultado{{ products.length === 1 ? '' : 's' }} para “{{ term }}”
            </p>
        </header>
        <div class="shop-toolbar"><button class="filters-toggle"
                @click="filtersOpen = !filtersOpen">Filtros</button><label>Ordenar<select v-model="filters.sort"
                    @change="load">
                    <option value="newest">Más recientes</option>
                    <option value="priceAsc">Precio: menor a mayor</option>
                    <option value="priceDesc">Precio: mayor a menor</option>
                    <option value="nameAsc">Nombre A-Z</option>
                    <option value="nameDesc">Nombre Z-A</option>
                </select></label></div>
        <ProductFilters v-show="filtersOpen" :filters="filters" :categories="categories" @update:filters="setFilter"
            @apply="load" @clear="clear" />
        <p v-if="loading">Cargando productos…</p>
        <p v-else-if="error" class="error-state">No hemos podido cargar la tienda. Inténtalo de nuevo.</p>
        <ProductGrid v-else-if="products.length" :products="products" />
        <p v-else class="empty-state">{{ isSearch ? 'No encontramos productos con esa búsqueda.' : 'No hay productos disponibles con estos filtros.' }}</p>
    </main>
</template>
<script setup>
import { computed, onMounted, ref, watch } from 'vue'; import { useRoute } from 'vue-router'; import ProductGrid from '../components/shop/ProductGrid.vue'; import ProductFilters from '../components/shop/ProductFilters.vue'; import { getProducts, searchProducts } from '../services/products'; import { getCategories } from '../services/categories'
const route = useRoute(), products = ref([]), categories = ref([]), loading = ref(true), error = ref(false), filtersOpen = ref(false); const filters = ref({ categoryId: '', minPrice: '', maxPrice: '', availability: '', sort: 'newest' }); const term = computed(() => String(route.query.q || '').trim()); const isSearch = computed(() => !!term.value)
function setFilter({ key, value }) { filters.value[key] = value } function clear() { filters.value = { categoryId: '', minPrice: '', maxPrice: '', availability: '', sort: 'newest' }; load() } async function load() { loading.value = true; error.value = false; const result = isSearch.value ? await searchProducts(term.value, filters.value) : await getProducts(filters.value); if (result.error) { console.error(result.error); error.value = true } else products.value = result.data || []; loading.value = false; document.title = isSearch.value ? `Buscar: ${term.value} | Tienda` : 'Tienda | Rincón de la esperanza' }
onMounted(async () => { const result = await getCategories(); categories.value = result.data || []; await load() }); watch(() => route.query.q, load)
</script>
