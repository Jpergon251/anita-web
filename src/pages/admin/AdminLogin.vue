<template>
    <main class="admin-login">
        <form v-if="!recovering" @submit.prevent="submit">
            <h1>Acceso administrador</h1>
            <p>Inicia sesión con la cuenta autorizada.</p>

            <label>
                Email
                <input v-model.trim="email" type="email" autocomplete="email" required>
            </label>

            <label>
                Contraseña
                <span class="password-input">
                    <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" required>
                    <button type="button" class="password-toggle" :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPassword" @click="showPassword = !showPassword">
                        <EyeOff v-if="showPassword" :size="18" aria-hidden="true" />
                        <Eye v-else :size="18" aria-hidden="true" />
                    </button>
                </span>
            </label>

            <p v-if="message" class="error-state" role="alert">{{ message }}</p>
            <button :disabled="sending">{{ sending ? 'Accediendo…' : 'Entrar' }}</button>
            <button type="button" class="text-button" @click="startRecovery">¿Olvidaste tu contraseña?</button>
        </form>

        <form v-else @submit.prevent="sendRecovery">
            <h1>Recuperar contraseña</h1>
            <p>Te enviaremos un enlace seguro para crear una nueva contraseña.</p>

            <label>
                Email de administración
                <input v-model.trim="recoveryEmail" type="email" autocomplete="email" required>
            </label>

            <p v-if="message" :class="recoverySent ? 'success-state' : 'error-state'" role="alert">{{ message }}</p>
            <button :disabled="sending">{{ sending ? 'Enviando…' : 'Enviar enlace' }}</button>
            <button type="button" class="text-button" @click="recovering = false; message = ''">Volver al acceso</button>
        </form>
    </main>
</template>

<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'

const email = ref('')
const password = ref('')
const sending = ref(false)
const message = ref('')
const showPassword = ref(false)
const recovering = ref(false)
const recoveryEmail = ref('')
const recoverySent = ref(false)
const router = useRouter()
const route = useRoute()
const auth = useAuth()

async function submit() {
    sending.value = true
    message.value = ''
    const { error } = await auth.login(email.value, password.value)
    sending.value = false

    if (error) {
        message.value = 'No se pudo iniciar sesión. Revisa tus datos.'
        return
    }

    await auth.initialize()
    if (!auth.isAdmin.value) {
        message.value = 'Esta cuenta no tiene permisos de administración.'
        await auth.logout()
        return
    }

    router.replace(route.query.redirect || '/admin')
}

function startRecovery() {
    recovering.value = true
    recoveryEmail.value = email.value
    message.value = ''
    recoverySent.value = false
}

async function sendRecovery() {
    sending.value = true
    message.value = ''
    recoverySent.value = false
    const { error } = await auth.requestPasswordReset(recoveryEmail.value)
    sending.value = false

    if (error) {
        console.error('No se pudo solicitar la recuperación:', error)
        message.value = 'No se pudo enviar el enlace. Inténtalo de nuevo.'
        return
    }

    recoverySent.value = true
    message.value = 'Si el email está registrado, recibirás un enlace para restablecer la contraseña.'
}
</script>
