<template>
    <section class="admin-page admin-products-page">
        <header class="admin-page-header">
            <div>
                <h1>Productos</h1>
                <p>Gestiona el catálogo y el stock.</p>
            </div>
            <RouterLink to="/admin/products/new" class="button">+ Nuevo producto</RouterLink>
        </header>

        <div class="catalog-tools">
            <label class="product-search">
                <span class="sr-only">Buscar productos</span>
                <input v-model.trim="search" type="search" placeholder="Buscar productos...">
            </label>
            <div class="status-filters" aria-label="Filtrar por publicación">
                <button v-for="filter in filters" :key="filter.value"
                    :class="{ selected: statusFilter === filter.value }" @click="statusFilter = filter.value">{{
                    filter.label }}</button>
            </div>
        </div>

        <p v-if="loading">Cargando productos…</p>
        <p v-else-if="error" class="error-state">No se pudo cargar el catálogo. Inténtalo de nuevo.</p>
        <template v-else>
            <p v-if="actionError" class="error-state" role="alert">{{ actionError }}</p>
            <div v-if="filteredProducts.length" class="admin-table-wrap products-list">
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in filteredProducts" :key="product.id">
                            <td class="table-product"><img v-if="product.image_url" :src="product.image_url"
                                    alt=""><span>{{ product.name }}</span></td>
                            <td data-label="Categoría">{{ product.categories?.name || '—' }}</td>
                            <td data-label="Precio">{{ money(product.price) }}</td>
                            <td data-label="Stock"><span class="stock-status" :class="stockClass(product.stock)">{{
                                    stockLabel(product.stock) }}</span></td>
                            <td data-label="Estado"><button class="publication-status" :disabled="processing"
                                    @click="openPublicationModal(product)"><span aria-hidden="true">{{ product.is_active
                                        ? '●' : '○' }}</span> {{ product.is_active ? 'Publicado' : 'No publicado'
                                    }}</button></td>
                            <td data-label="Acciones" class="product-actions">
                                <RouterLink :to="`/admin/products/${product.id}/edit`">Editar</RouterLink>
                                <!-- <button :disabled="processing" @click="openPublicationModal(product)">{{ product.is_active ? 'Retirar' : 'Publicar' }}</button> -->
                                <button class="danger-link" :disabled="processing"
                                    @click="openDeleteModal(product)">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else class="empty-state">{{ products.length ? 'No se encontraron productos.' : 'Todavía no hay productos.' }}</p>
        </template>

        <ConfirmModal :open="!!pendingPublication"
            :title="pendingPublication?.is_active ? '¿Quieres retirar este producto de la tienda?' : '¿Quieres publicar este producto?'"
            :message="pendingPublication?.is_active ? 'El producto seguirá guardado en tu catálogo, pero dejará de aparecer públicamente en la tienda.' : 'El producto pasará a estar visible para los clientes en la tienda.'"
            :confirm-text="pendingPublication?.is_active ? 'Retirar de la tienda' : 'Publicar producto'"
            :loading="processing" @close="pendingPublication = null" @confirm="confirmPublication" />
        <ConfirmModal :open="!!pendingDeletion" title="Eliminar producto"
            message="Esta acción eliminará el producto del catálogo y no se puede deshacer."
            confirm-text="Eliminar producto" :loading="processing" danger @close="pendingDeletion = null"
            @confirm="confirmDelete" />
    </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ConfirmModal from '../../components/ui/ConfirmModal.vue'
import { deleteProduct, getProducts, removeProductImage, toggleProductActive } from '../../services/products'
import { useAuth } from '../../stores/auth'
import { supabase } from '../../../utils/supabase'
const products = ref([])
const loading = ref(true)
const error = ref(false)
const actionError = ref('')
const search = ref('')
const statusFilter = ref('all')
const pendingPublication = ref(null)
const pendingDeletion = ref(null)
const processing = ref(false)
const filters = [{ value: 'all', label: 'Todas' }, { value: 'published', label: 'Publicados' }, { value: 'unpublished', label: 'No publicados' }]
const auth = useAuth()

const filteredProducts = computed(() => products.value.filter(product => {
    const matchesName = product.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || (statusFilter.value === 'published' ? product.is_active : !product.is_active)
    return matchesName && matchesStatus
}))

const money = value => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value || 0)
const stockLabel = stock => stock === 0 ? 'Agotado' : stock <= 5 ? `Poco stock (${stock})` : `Disponible (${stock})`
const stockClass = stock => stock === 0 ? 'out' : stock <= 5 ? 'low' : 'available'

async function load() {
    loading.value = true
    error.value = false
    const result = await getProducts({}, true)
    if (result.error) { console.error(result.error); error.value = true } else products.value = result.data || []
    loading.value = false
}

function openPublicationModal(product) { actionError.value = ''; pendingPublication.value = product }
function openDeleteModal(product) { actionError.value = ''; pendingDeletion.value = product }

async function confirmPublication() {
    const product = pendingPublication.value

    if (!product || processing.value) return

    processing.value = true
    actionError.value = ''

    try {
        const nextIsActive = !product.is_active

        const { error: updateError } = await toggleProductActive(
            product.id,
            nextIsActive
        )

        if (updateError) {
            console.error(
                '[Admin products] Error al actualizar is_active:',
                updateError
            )

            actionError.value =
                'No se pudo cambiar el estado del producto. Inténtalo de nuevo.'

            return
        }

        product.is_active = nextIsActive
        pendingPublication.value = null
    } finally {
        processing.value = false
    }
}

async function confirmDelete() {
    const product = pendingDeletion.value
    if (!product || processing.value) return
    processing.value = true
    const { error: deleteError } = await deleteProduct(product.id)
    if (deleteError) { console.error(deleteError); actionError.value = 'No se pudo eliminar el producto. Inténtalo de nuevo.' } else { await removeProductImage(product.image_url); products.value = products.value.filter(item => item.id !== product.id); pendingDeletion.value = null }
    processing.value = false
}

onMounted(load)
</script>
