<template>
    <Teleport to="body">
        <Transition name="cart-backdrop">
            <div
                v-if="open"
                class="cart-backdrop"
                aria-hidden="true"
                @click="$emit('close')"
            />
        </Transition>

        <Transition name="cart-drawer">
            <aside
                v-if="open"
                class="cart-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="cart-drawer-title"
            >
                <header class="cart-drawer__header">
                    <h2 id="cart-drawer-title">Tu carrito</h2>

                    <button
                        class="cart-drawer__close"
                        type="button"
                        aria-label="Cerrar carrito"
                        @click="$emit('close')"
                    >
                        <X aria-hidden="true" />
                    </button>
                </header>

                <div
                    v-if="!cart.items.length"
                    class="cart-drawer__empty"
                >
                    <ShoppingBag aria-hidden="true" />
                    <p>Tu carrito está vacío</p>
                    <span>Añade productos para verlos aquí.</span>
                </div>

                <template v-else>
                    <div class="cart-drawer__items">
                        <article
                            v-for="item in cart.items"
                            :key="item.id"
                            class="cart-item"
                        >
                            <img
                                v-if="item.image_url"
                                :src="item.image_url"
                                :alt="item.name"
                                class="cart-item__image"
                            >
                            <PackageOpen 
                                v-else-if="!item.image_url"
                                class="cart-item__image" 
                            />
                            <div class="cart-item__details">
                                <h3>{{ item.name }}</h3>
                                <p>{{ formatPrice(item.price) }}</p>

                                <div class="cart-item__quantity">
                                    <button
                                        type="button"
                                        :aria-label="`Reducir cantidad de ${item.name}`"
                                        @click="cart.decreaseQuantity(item.id)"
                                    >
                                        <Minus aria-hidden="true" />
                                    </button>
                                    <span :aria-label="`Cantidad: ${item.quantity}`">{{ item.quantity }}</span>
                                    <button
                                        type="button"
                                        :aria-label="`Aumentar cantidad de ${item.name}`"
                                        @click="cart.increaseQuantity(item.id)"
                                    >
                                        <Plus aria-hidden="true" />
                                    </button>
                                </div>
                            </div>

                            <button
                                class="cart-item__remove"
                                type="button"
                                :aria-label="`Eliminar ${item.name} del carrito`"
                                @click="cart.removeItem(item.id)"
                            >
                                <Trash2 aria-hidden="true" />
                            </button>
                        </article>
                    </div>

                    <footer class="cart-drawer__summary">
                        <div>
                            <span>Subtotal</span>
                            <strong>{{ formatPrice(cart.totalPrice) }}</strong>
                        </div>
                        <div class="cart-drawer__total">
                            <span>Total</span>
                            <strong>{{ formatPrice(cart.totalPrice) }}</strong>
                        </div>
                        <button type="button">Tramitar pedido</button>
                    </footer>
                </template>
            </aside>
        </Transition>
    </Teleport>
</template>

<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { Minus, PackageOpen, Plus, ShoppingBag, Trash2, X } from 'lucide-vue-next'
import { useCartStore } from '../stores/cart.js'

const props = defineProps({
    open: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['close'])
const cart = useCartStore()

const currencyFormatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
})

function formatPrice(price) {
    return currencyFormatter.format(Number(price) || 0)
}

function handleKeydown(event) {
    if (props.open && event.key === 'Escape') {
        emit('close')
    }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>
