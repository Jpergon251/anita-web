<template>
    <main class="shop-page detail-page">

        <!-- LOADING -->
        <section v-if="loading" class="loading-state">
            <p>Cargando producto…</p>
        </section>

        <!-- PRODUCT -->
        <section v-else-if="product" class="product-detail">

            <div class="detail-image">
                <img
                    v-if="product.image_url"
                    :src="product.image_url"
                    :alt="product.name"
                >

                <PackageOpen
                    v-else
                    :size="72"
                    aria-label="Producto sin imagen"
                />
            </div>

            <div class="detail-content">

                <p
                    v-if="product.categories?.name"
                    class="product-category"
                >
                    {{ product.categories.name }}
                </p>

                <h1>{{ product.name }}</h1>

                <p class="detail-price">
                    {{ price }}
                </p>

                <p
                    class="availability"
                    :class="{
                        out: product.stock <= 0,
                        low: product.stock > 0 && product.stock <= 5,
                        available: product.stock > 5
                    }"
                >
                    <span class="availability-dot"></span>
                    {{ availability }}
                </p>

                <p class="description">
                    {{ product.description || 'Sin descripción disponible.' }}
                </p>

                <div class="detail-actions">

                    <!-- Más adelante aquí puede ir "Agregar al carrito" -->

                    <RouterLink
                        to="/shop"
                        class="back-link"
                    >
                        ← Volver a la tienda
                    </RouterLink>

                </div>

            </div>

        </section>

        <!-- NOT FOUND -->
        <section v-else class="not-found">

            <PackageOpen
                :size="56"
                stroke-width="1.5"
            />

            <h1>Producto no encontrado</h1>

            <p>
                Es posible que este producto ya no esté disponible.
            </p>

            <RouterLink to="/shop" class="back-link">
                ← Volver a la tienda
            </RouterLink>

        </section>

    </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { PackageOpen } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { getProductBySlug } from '../services/products'

const route = useRoute()

const product = ref(null)
const loading = ref(true)

const price = computed(() => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    }).format(product.value?.price || 0)
})

const availability = computed(() => {
    if (!product.value) return ''

    if (product.value.stock <= 0) {
        return 'Agotado'
    }

    if (product.value.stock <= 5) {
        return 'Últimas unidades'
    }

    return 'Disponible'
})

onMounted(async () => {
    const { data } = await getProductBySlug(route.params.slug)

    product.value = data
    loading.value = false

    document.title = data
        ? `${data.name} | Rincón de la Esperanza`
        : 'Producto no encontrado'
})
</script>