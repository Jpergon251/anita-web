<template>
    <Teleport to="body">
        <div v-if="open" class="modal-backdrop" @click.self="close">
            <section ref="modal" class="confirm-modal" role="dialog" aria-modal="true" :aria-labelledby="titleId" tabindex="-1">
                <button class="modal-close" type="button" aria-label="Cerrar" :disabled="loading" @click="close">×</button>
                <h2 :id="titleId">{{ title }}</h2>
                <p>{{ message }}</p>
                <div class="modal-actions">
                    <button type="button" class="secondary-button" :disabled="loading" @click="close">{{ cancelText }}</button>
                    <button type="button" :class="danger ? 'danger-button' : 'button'" :disabled="loading" @click="$emit('confirm')">
                        {{ loading ? 'Procesando…' : confirmText }}
                    </button>
                </div>
            </section>
        </div>
    </Teleport>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    open: Boolean,
    title: { type: String, required: true },
    message: { type: String, required: true },
    confirmText: { type: String, required: true },
    cancelText: { type: String, default: 'Cancelar' },
    loading: Boolean,
    danger: Boolean
})

const emit = defineEmits(['close', 'confirm'])
const titleId = computed(() => `confirm-modal-${props.title.replace(/\s/g, '-').toLowerCase()}`)
const modal = ref(null)

function close() {
    if (!props.loading) emit('close')
}

function onKeydown(event) {
    if (event.key === 'Escape') close()
}

watch(() => props.open, async isOpen => {
    if (isOpen) {
        await nextTick()
        modal.value?.focus()
        document.addEventListener('keydown', onKeydown)
    } else {
        document.removeEventListener('keydown', onKeydown)
    }
})

onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))
</script>
