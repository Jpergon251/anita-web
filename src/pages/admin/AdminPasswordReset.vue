<template>
    <main class="admin-login">
        <form @submit.prevent="savePassword">
            <h1>Nueva contraseña</h1>
            <p>Elige una contraseña nueva para tu cuenta de administración.</p>

            <label>
                Nueva contraseña
                <span class="password-input">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="password-toggle" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword">
                        <EyeOff v-if="showPassword" :size="18" aria-hidden="true" />
                        <Eye v-else :size="18" aria-hidden="true" />
                    </button>
                </span>
            </label>

            <label>
                Repetir contraseña
                <span class="password-input">
                    <input v-model="confirmation" :type="showConfirmation ? 'text' : 'password'" autocomplete="new-password" minlength="8" required>
                    <button type="button" class="password-toggle" :aria-label="showConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showConfirmation" @click="showConfirmation = !showConfirmation">
                        <EyeOff v-if="showConfirmation" :size="18" aria-hidden="true" />
                        <Eye v-else :size="18" aria-hidden="true" />
                    </button>
                </span>
            </label>

            <p v-if="message" :class="success ? 'success-state' : 'error-state'" role="alert">{{ message }}</p>
            <button :disabled="sending || !hasRecoverySession">{{ sending ? 'Guardando…' : 'Guardar nueva contraseña' }}</button>
            <RouterLink to="/admin/login">Volver al acceso</RouterLink>
        </form>
    </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { supabase } from '../../../utils/supabase'
import { useAuth } from '../../stores/auth'

const password = ref('')
const confirmation = ref('')
const sending = ref(false)
const success = ref(false)
const message = ref('')
const showPassword = ref(false)
const showConfirmation = ref(false)
const hasRecoverySession = ref(false)
const router = useRouter()
const auth = useAuth()

onMounted(async () => {
    const { data, error } = await supabase.auth.getSession()
    hasRecoverySession.value = !!data.session && !error
    if (!hasRecoverySession.value) message.value = 'El enlace no es válido o ha caducado. Solicita uno nuevo.'
})

async function savePassword() {
    message.value = ''
    success.value = false
    if (password.value.length < 8) { message.value = 'La contraseña debe tener al menos 8 caracteres.'; return }
    if (password.value !== confirmation.value) { message.value = 'Las contraseñas no coinciden.'; return }

    sending.value = true
    const { error } = await auth.updateAccount({ password: password.value })
    sending.value = false
    if (error) { console.error('No se pudo cambiar la contraseña:', error); message.value = 'No se pudo actualizar la contraseña. Solicita un enlace nuevo.'; return }
    success.value = true
    message.value = 'Contraseña actualizada. Redirigiendo al panel…'
    setTimeout(() => router.replace('/admin'), 1200)
}
</script>
