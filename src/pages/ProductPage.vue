<template>
  <main class="shop-page detail-page">
    <!-- LOADING -->
    <section v-if="loading" class="loading-state">
      <p>Cargando producto…</p>
    </section>

    <!-- PRODUCT -->
    <section v-else-if="product" class="product-detail">

      <!-- IMAGEN -->
      <div class="detail-image">
        <img
          v-if="product.image_url"
          :src="product.image_url"
          :alt="product.name"
        />

        <PackageOpen
          v-else
          :size="72"
          aria-label="Producto sin imagen"
        />
      </div>

      <!-- INFORMACIÓN -->
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

        <!-- DISPONIBILIDAD -->
        <p
          class="availability"
          :class="{
            out: product.stock <= 0,
            low: product.stock > 0 && product.stock <= 5,
            available: product.stock > 5,
          }"
        >
          <span class="availability-dot"></span>

          {{ availability }}
        </p>

        <!-- DESCRIPCIÓN -->
        <p class="description">
          {{ product.description || "Sin descripción disponible." }}
        </p>

        <!-- COMPRA -->
        <div
          v-if="product.stock > 0"
          class="purchase-box"
        >

          <!-- CANTIDAD -->
          <div class="quantity-control">
            <span class="quantity-label">
              Cantidad
            </span>

            <div class="quantity-selector">
              <button
                type="button"
                aria-label="Reducir cantidad"
                :disabled="quantity <= 1"
                @click="decreaseQuantity"
              >
                −
              </button>

              <span>
                {{ quantity }}
              </span>

              <button
                type="button"
                aria-label="Aumentar cantidad"
                :disabled="quantity >= product.stock"
                @click="increaseQuantity"
              >
                +
              </button>
            </div>
          </div>

          <!-- BOTONES -->
          <div class="purchase-actions">

            <button
              type="button"
              class="add-cart-button"
              @click="addToCart"
            >
              <ShoppingBag :size="19" />

              {{ addedToCart ? "Añadido a la cesta" : "Añadir a la cesta" }}
            </button>

            <button
              type="button"
              class="buy-button"
              disabled
              title="Disponible próximamente"
            >
              Comprar ahora
            </button>

          </div>

          <p
            v-if="addedToCart"
            class="cart-success"
            role="status"
          >
            ✓ Producto añadido a tu cesta
          </p>

        </div>

        <!-- AGOTADO -->
        <div
          v-else
          class="out-of-stock"
        >
          <strong>Producto agotado</strong>

          <p>
            Actualmente no quedan unidades disponibles.
          </p>
        </div>

        <!-- VOLVER -->
        <RouterLink
          to="/shop"
          class="back-link"
        >
          ← Volver a la tienda
        </RouterLink>

      </div>
    </section>

    <!-- NOT FOUND -->
    <section
      v-else
      class="not-found"
    >
      <PackageOpen
        :size="56"
        stroke-width="1.5"
      />

      <h1>Producto no encontrado</h1>

      <p>
        Es posible que este producto ya no esté disponible.
      </p>

      <RouterLink
        to="/shop"
        class="back-link"
      >
        ← Volver a la tienda
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from "vue";

import {
  PackageOpen,
  ShoppingBag,
} from "lucide-vue-next";

import {
  useRoute,
} from "vue-router";

import {
  getProductBySlug,
} from "../services/products";

import {
  useCartStore,
} from "../stores/cart";

const route = useRoute();

const cart = useCartStore();

const product = ref(null);
const loading = ref(true);

const quantity = ref(1);
const addedToCart = ref(false);

const price = computed(() => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(product.value?.price || 0);
});

const availability = computed(() => {
  if (!product.value) return "";

  const stock = Number(product.value.stock) || 0;

  if (stock <= 0) {
    return "Sin stock";
  }

  if (stock <= 3) {
    return `Poco stock · ${stock} ${stock === 1 ? "unidad" : "unidades"}`;
  }

  return "Stock disponible";
});

function increaseQuantity() {
  if (!product.value) return;

  if (quantity.value < product.value.stock) {
    quantity.value++;
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function addToCart() {
  if (!product.value || product.value.stock <= 0) {
    return;
  }

  cart.addItem(product.value, quantity.value);

  addedToCart.value = true;

  setTimeout(() => {
    addedToCart.value = false;
  }, 2500);
}

onMounted(async () => {
  const { data } = await getProductBySlug(
    route.params.slug
  );

  product.value = data;
  loading.value = false;

  document.title = data
    ? `${data.name} | Rincón de la Esperanza`
    : "Producto no encontrado";
});
</script>