<template>
  <main class="shop-page">
    <p v-if="loading">Cargando categoría…</p>
    <template v-else-if="category"
      ><header class="shop-heading">
        <p class="eyebrow">Categoría</p>
        <h1>{{ category.name }}</h1>
        <p v-if="category.description">{{ category.description }}</p>
      </header>
      <ProductGrid v-if="products.length" :products="products" />
      <p v-else class="empty-state">
        Aún no hay productos disponibles en esta categoría.
      </p></template
    >
    <section v-else class="not-found">
      <h1>Categoría no encontrada</h1>
      <RouterLink to="/shop">Volver a la tienda</RouterLink>
    </section>
  </main>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import ProductGrid from "../components/shop/ProductGrid.vue";
import { getCategoryBySlug } from "../services/categories";
import { getProductsByCategory } from "../services/products";
import { findKnownCategory } from "../utils/categoriesCatalog";

const route = useRoute(),
  category = ref(null),
  products = ref([]),
  loading = ref(true);

async function loadCategory() {
  loading.value = true;
  try {
    const result = await getCategoryBySlug(route.params.slug);
    category.value = result?.data;
    if (category.value) {
      const { data } = await getProductsByCategory(category.value.id);
      products.value = data || [];
      document.title = `${category.value.name} | Tienda`;
    } else {
      const known = findKnownCategory(route.params.slug);
      if (known) {
        category.value = known;
        products.value = [];
        document.title = `${known.name} | Tienda`;
      }
    }
  } finally {
    loading.value = false;
  }
}

onMounted(loadCategory);
watch(() => route.params.slug, loadCategory);
</script>
