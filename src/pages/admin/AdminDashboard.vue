<template>
    <section class="admin-page">
        <h1>Resumen</h1>
        <p v-if="loading">Cargando estadísticas…</p>
        <p v-else-if="error" class="error-state">No se pudieron cargar las estadísticas.</p>

        <div v-else class="stats">
            <article><strong>{{ stats.total }}</strong><span>Productos totales</span></article>
            <article><strong>{{ stats.active }}</strong><span>Productos activos</span></article>
            <article><strong>{{ stats.inactive }}</strong><span>Productos inactivos</span></article>
            <article><strong>{{ stats.low }}</strong><span>Stock bajo</span></article>
            <article><strong>{{ stats.categories }}</strong><span>Categorías</span></article>
        </div>

        <section class="account-settings" aria-labelledby="account-title">
            <div>
                <h2 id="account-title">Cuenta de administración</h2>
                <p>Actualiza el email o la contraseña con Supabase Auth.</p>
            </div>

            <div class="account-settings-grid">
                <form class="admin-form" @submit.prevent="changeEmail">
                    <h3>Cambiar email</h3>
                    <label>Email actual<input :value="auth.user.value?.email || ''" type="email" disabled></label>
                    <label>Nuevo email<input v-model.trim="newEmail" type="email" autocomplete="email" required></label>
                    <label>
                        Contraseña actual
                        <span class="password-input">
                            <input v-model="currentPassword" :type="showCurrentPassword ? 'text' : 'password'" autocomplete="current-password" required>
                            <button type="button" class="password-toggle" :aria-label="showCurrentPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showCurrentPassword" @click="showCurrentPassword = !showCurrentPassword">
                                <EyeOff v-if="showCurrentPassword" :size="18" aria-hidden="true" />
                                <Eye v-else :size="18" aria-hidden="true" />
                            </button>
                        </span>
                    </label>
                    <label>
                        Repetir contraseña actual
                        <span class="password-input">
                            <input v-model="passwordRepeat" :type="showPasswordRepeat ? 'text' : 'password'" autocomplete="current-password" required>
                            <button type="button" class="password-toggle" :aria-label="showPasswordRepeat ? 'Ocultar contraseña' : 'Mostrar contraseña'" :aria-pressed="showPasswordRepeat" @click="showPasswordRepeat = !showPasswordRepeat">
                                <EyeOff v-if="showPasswordRepeat" :size="18" aria-hidden="true" />
                                <Eye v-else :size="18" aria-hidden="true" />
                            </button>
                        </span>
                    </label>
                    <p v-if="emailMessage" :class="emailSuccess ? 'success-state' : 'error-state'" role="alert">{{ emailMessage }}</p>
                    <button type="submit" :disabled="emailSending">{{ emailSending ? 'Guardando…' : 'Actualizar email' }}</button>
                </form>

                <section class="admin-form password-recovery-card">
                    <h3>Cambiar contraseña</h3>
                    <p>Por seguridad, te enviaremos un enlace al email actual para que puedas crear una nueva contraseña.</p>
                    <p class="account-email">{{ auth.user.value?.email || 'Email no disponible' }}</p>
                    <p v-if="passwordMessage" :class="passwordSuccess ? 'success-state' : 'error-state'" role="alert">{{ passwordMessage }}</p>
                    <button type="button" :disabled="passwordSending || !auth.user.value?.email" @click="sendPasswordEmail">{{ passwordSending ? 'Enviando…' : 'Enviar email para cambiar contraseña' }}</button>
                </section>
            </div>
        </section>
    </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { supabase } from '../../../utils/supabase'
import { useAuth } from '../../stores/auth'

const loading = ref(true)
const error = ref(false)
const stats = reactive({ total: 0, active: 0, inactive: 0, low: 0, categories: 0 })
const auth = useAuth()
const newEmail = ref('')
const currentPassword = ref('')
const passwordRepeat = ref('')
const showCurrentPassword = ref(false)
const showPasswordRepeat = ref(false)
const emailSending = ref(false)
const passwordSending = ref(false)
const emailMessage = ref('')
const passwordMessage = ref('')
const emailSuccess = ref(false)
const passwordSuccess = ref(false)

onMounted(async () => {
    const [all, active, low, categories] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('products').select('id', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('products').select('id', { count: 'exact', head: true }).lte('stock', 5).gt('stock', 0),
        supabase.from('categories').select('id', { count: 'exact', head: true })
    ])

    if ([all, active, low, categories].some(result => result.error)) error.value = true
    else Object.assign(stats, { total: all.count || 0, active: active.count || 0, inactive: (all.count || 0) - (active.count || 0), low: low.count || 0, categories: categories.count || 0 })
    loading.value = false
})

async function changeEmail() {
    emailMessage.value = ''
    emailSuccess.value = false
    if (newEmail.value.toLowerCase() === auth.user.value?.email?.toLowerCase()) { emailMessage.value = 'Introduce un email diferente al actual.'; return }
    if (currentPassword.value !== passwordRepeat.value) { emailMessage.value = 'Las contraseñas no coinciden.'; return }
    emailSending.value = true
    const { error: passwordError } = await auth.verifyCurrentPassword(currentPassword.value)
    if (passwordError) {
        console.error('No se pudo verificar la contraseña:', passwordError)
        emailSending.value = false
        emailMessage.value = 'La contraseña actual no es correcta.'
        return
    }
    const { error: updateError } = await auth.updateAccount({ email: newEmail.value })
    emailSending.value = false
    if (updateError) { console.error('No se pudo actualizar el email:', updateError); emailMessage.value = 'No se pudo actualizar el email. Inténtalo de nuevo.'; return }
    emailSuccess.value = true
    emailMessage.value = 'Solicitud enviada. Abre el email enviado a la nueva dirección y confírmalo para completar el cambio.'
    newEmail.value = ''
    currentPassword.value = ''
    passwordRepeat.value = ''
}

async function sendPasswordEmail() {
    passwordMessage.value = ''
    passwordSuccess.value = false
    passwordSending.value = true
    const { error: updateError } = await auth.requestPasswordReset(auth.user.value.email)
    passwordSending.value = false
    if (updateError) { console.error('No se pudo enviar el email de recuperación:', updateError); passwordMessage.value = 'No se pudo enviar el email. Inténtalo de nuevo.'; return }
    passwordSuccess.value = true
    passwordMessage.value = 'Email enviado. Revisa tu bandeja de entrada para continuar.'
}
</script>
