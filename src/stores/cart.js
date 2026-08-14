import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export const useCartStore = defineStore('cart', () => {
    // Recuperar carrito guardado
    const savedCart = localStorage.getItem('cart')

    const items = ref(
        savedCart ? JSON.parse(savedCart) : []
    )

    // Número total de unidades
    const totalItems = computed(() => {
        return items.value.reduce(
            (total, item) => total + item.quantity,
            0
        )
    })

    // Precio total
    const totalPrice = computed(() => {
        return items.value.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        )
    })

    // Añadir producto
    function addItem(product) {
        const existingItem = items.value.find(
            item => item.id === product.id
        )

        if (existingItem) {
            existingItem.quantity++
            return
        }

        items.value.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url,
            quantity: 1
        })
    }

    // Eliminar producto completamente
    function removeItem(productId) {
        items.value = items.value.filter(
            item => item.id !== productId
        )
    }

    // Aumentar cantidad
    function increaseQuantity(productId) {
        const item = items.value.find(
            item => item.id === productId
        )

        if (item) {
            item.quantity++
        }
    }

    // Disminuir cantidad
    function decreaseQuantity(productId) {
        const item = items.value.find(
            item => item.id === productId
        )

        if (!item) return

        if (item.quantity <= 1) {
            removeItem(productId)
            return
        }

        item.quantity--
    }

    // Vaciar carrito
    function clearCart() {
        items.value = []
    }

    // Guardar automáticamente en localStorage
    watch(
        items,
        value => {
            localStorage.setItem(
                'cart',
                JSON.stringify(value)
            )
        },
        {
            deep: true
        }
    )

    return {
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart
    }
})