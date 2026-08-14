<template>
    <form class="admin-form" @submit.prevent="save">

        <label>
            Nombre
            <input
                v-model.trim="form.name"
                required
            >
        </label>

        <label>
            Slug
            <input
                v-model="form.slug"
                type="text"
                readonly
            >
            <small>
                El slug se genera automáticamente a partir del nombre.
            </small>
        </label>

        <label>
            Descripción
            <textarea
                v-model.trim="form.description"
                rows="5"
            />
        </label>

        <div class="form-row">
            <label>
                Precio
                <input
                    v-model.number="form.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                >
            </label>

            <label>
                Stock
                <input
                    v-model.number="form.stock"
                    type="number"
                    min="0"
                    step="1"
                    required
                >
            </label>
        </div>

        <label>
            Categoría
            <select
                v-model="form.category_id"
                required
            >
                <option
                    disabled
                    value=""
                >
                    Selecciona una categoría
                </option>

                <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                >
                    {{ category.name }}
                </option>
            </select>
        </label>

        <label class="checkbox">
            <input
                v-model="form.is_active"
                type="checkbox"
            >

            <span>
                Publicar producto

                <small>
                    Si está publicado, aparecerá en la tienda pública.
                </small>
            </span>
        </label>

        <label>
            Imagen

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                @change="selectImage"
            >

            <small>
                JPG, PNG o WebP, máximo 5 MB.
            </small>
        </label>

        <img
            v-if="preview"
            class="image-preview"
            :src="preview"
            alt="Vista previa de producto"
        >

        <p
            v-if="message"
            :class="error ? 'error-state' : 'success-state'"
        >
            {{ message }}
        </p>

        <div class="form-actions">
            <RouterLink to="/admin/products">
                Cancelar
            </RouterLink>

            <button
                :disabled="saving"
                type="submit"
            >
                {{ saving ? 'Guardando…' : 'Guardar producto' }}
            </button>
        </div>

    </form>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

import {
    createProduct,
    getUniqueSlug,
    removeProductImage,
    updateProduct,
    uploadProductImage
} from '../../services/products'

const props = defineProps({
    product: {
        type: Object,
        default: null
    },

    categories: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['saved'])

const form = reactive({
    name: props.product?.name || '',
    slug: props.product?.slug || '',
    description: props.product?.description || '',
    price: props.product?.price ?? 0,
    stock: props.product?.stock ?? 0,
    category_id: props.product?.category_id || '',
    is_active: props.product?.is_active ?? false
})

const preview = ref(props.product?.image_url || '')
const image = ref(null)

const saving = ref(false)
const message = ref('')
const error = ref(false)

watch(
    () => form.name,
    async (name) => {
        if (!name?.trim()) {
            form.slug = ''
            return
        }

        const result = await getUniqueSlug(
            name,
            props.product?.id
        )

        if (!result.error) {
            form.slug = result.slug
        }
    }
)

function selectImage(event) {
    const file = event.target.files?.[0]

    message.value = ''
    error.value = false

    if (!file) return

    if (
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ||
        file.size > 5 * 1024 * 1024
    ) {
        error.value = true

        message.value =
            'Elige una imagen JPG, PNG o WebP de hasta 5 MB.'

        event.target.value = ''

        return
    }

    image.value = file
    preview.value = URL.createObjectURL(file)
}

async function save() {
    message.value = ''
    error.value = false

    if (form.price < 0 || form.stock < 0) {
        error.value = true
        message.value =
            'El precio y el stock no pueden ser negativos.'

        return
    }

    saving.value = true

    let imageUrl = props.product?.image_url || ''

    if (image.value) {
        const upload = await uploadProductImage(image.value)

        if (upload.error) {
            error.value = true
            message.value = 'No se pudo subir la imagen.'
            saving.value = false

            return
        }

        imageUrl = upload.data.url
    }

    const payload = {
        ...form,
        image_url: imageUrl
    }

    const result = props.product
        ? await updateProduct(props.product.id, payload)
        : await createProduct(payload)

    if (result.error) {
        error.value = true

        message.value =
            result.error.code === '23505'
                ? 'Ese slug ya está en uso.'
                : 'No se pudo guardar el producto.'

        if (image.value && imageUrl) {
            await removeProductImage(imageUrl)
        }
    } else {
        if (
            image.value &&
            props.product?.image_url
        ) {
            await removeProductImage(
                props.product.image_url
            )
        }

        emit('saved', result.data)
    }

    saving.value = false
}
</script>