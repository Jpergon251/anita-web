import { computed, reactive } from 'vue'
import { supabase } from '../../utils/supabase'

const state = reactive({ user: null, profile: null, loading: true, initialized: false })
let listener

async function loadProfile(user) {
  if (!user) { state.profile = null; return }
  const { data, error } = await supabase.from('profiles').select('id, role').eq('id', user.id).maybeSingle()
  if (error) console.error('No se pudo obtener el perfil:', error.message)
  state.profile = data || null
}

async function initialize() {
  if (state.initialized) return
  state.loading = true
  const { data } = await supabase.auth.getSession()
  state.user = data.session?.user || null
  await loadProfile(state.user)
  state.loading = false; state.initialized = true
  listener = supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null
    void loadProfile(state.user).finally(() => { state.loading = false })
  }).data.subscription
}

async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) { state.user = data.user; await loadProfile(data.user) }
  return { error }
}

async function verifyCurrentPassword(password) {
  if (!state.user?.email) return { error: new Error('No hay una sesión activa.') }
  return login(state.user.email, password)
}
async function logout() { const { error } = await supabase.auth.signOut(); if (!error) { state.user = null; state.profile = null }; return { error } }

async function requestPasswordReset(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`
  })
}

async function updateAccount(attributes) {
  const { data, error } = await supabase.auth.updateUser(attributes)
  if (!error && data.user) state.user = data.user
  return { data, error }
}

export function useAuth() {
  return { state, user: computed(() => state.user), profile: computed(() => state.profile), isAuthenticated: computed(() => !!state.user), isAdmin: computed(() => state.profile?.role === 'admin'), loading: computed(() => state.loading), initialize, login, logout, requestPasswordReset, updateAccount, verifyCurrentPassword }
}
