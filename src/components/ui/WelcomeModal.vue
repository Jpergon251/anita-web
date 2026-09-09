<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="welcome-modal-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-modal-title"
        @click.self="dismiss"
      >
        <div class="welcome-modal-card">
          <button
            class="welcome-modal-close"
            type="button"
            aria-label="Cerrar modal de bienvenida"
            @click="dismiss"
          >
            ×
          </button>

          <div class="welcome-modal-header">
            <span class="welcome-modal-badge" aria-hidden="true">💝</span>
            <h2 id="welcome-modal-title">
              REGALO DE BIENVENIDA
            </h2>
            <p class="welcome-modal-subtitle">
              Suscribite y recibí un <strong>10% OFF</strong> para tu primera compra
            </p>
          </div>

          <form
            v-if="!submitted"
            class="welcome-modal-form"
            @submit.prevent="handleSubmit"
          >
            <div class="welcome-modal-field">
              <label for="welcome-name">Nombre</label>
              <input
                id="welcome-name"
                v-model.trim="name"
                type="text"
                placeholder="Tu nombre"
                required
                autocomplete="given-name"
              />
            </div>

            <div class="welcome-modal-field">
              <label for="welcome-email">Email</label>
              <input
                id="welcome-email"
                v-model.trim="email"
                type="email"
                placeholder="tu@email.com"
                required
                autocomplete="email"
              />
            </div>

            <button type="submit" class="welcome-modal-submit">
              Recibir cupón
            </button>
          </form>

          <!-- Estado informativo honesto sin simular almacenamiento inexistente -->
          <div v-else class="welcome-modal-info" role="status">
            <p>
              ¡Gracias por tu interés! La activación automática de cupones por email estará disponible próximamente con el lanzamiento oficial de nuestra tienda online.
            </p>
            <button
              type="button"
              class="welcome-modal-submit"
              @click="dismiss"
            >
              Continuar a la tienda
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const STORAGE_KEY = 'rincon_welcome_modal_dismissed'

const isOpen = ref(false)
const name = ref('')
const email = ref('')
const submitted = ref(false)

function openModal() {
  try {
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === 'true'
    if (!wasDismissed) {
      // Retraso suave tras cargar la página para una experiencia no invasiva
      setTimeout(() => {
        isOpen.value = true
      }, 1200)
    }
  } catch {
    // Si localStorage no está disponible
  }
}

function dismiss() {
  isOpen.value = false
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    //
  }
}

function handleKeydown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    dismiss()
  }
}

function handleSubmit() {
  if (!name.value || !email.value) return

  // ========================================================
  // PUNTO DE INTEGRACIÓN:
  // TODO: Conectar con el servicio de email marketing o API de cupones
  // cuando esté configurado en el backend del proyecto.
  // Actualmente solo valida la interfaz en el cliente y muestra
  // el aviso informativo sin simular guardado falso.
  // ========================================================
  submitted.value = true
}

onMounted(() => {
  openModal()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.welcome-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 999;

  display: grid;
  place-items: center;

  padding: clamp(1rem, 4vw, 2rem);
  background: rgba(47, 47, 47, 0.45);
  backdrop-filter: blur(4px);
}

.welcome-modal-card {
  position: relative;
  width: min(100%, 420px);

  padding: clamp(1.75rem, 5vw, 2.5rem);

  background: linear-gradient(
    145deg,
    var(--color-white),
    var(--color-pink-50)
  );

  border: 1px solid var(--color-pink-200);
  border-radius: var(--radius-xl);

  box-shadow: var(--shadow-lg);

  text-align: center;
  box-sizing: border-box;
}

.welcome-modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;

  width: 32px;
  height: 32px;

  display: grid;
  place-items: center;

  border: 1px solid var(--color-pink-200);
  border-radius: 50%;

  background: var(--color-white);
  color: var(--color-pink-600);

  font-size: 1.3rem;
  line-height: 1;

  cursor: pointer;

  transition:
    background var(--transition-fast),
    color var(--transition-fast),
    transform var(--transition-fast);

  &:hover {
    background: var(--color-pink-500);
    color: var(--color-white);
    transform: scale(1.05);
  }

  &:focus-visible {
    outline: 3px solid rgba(170, 93, 120, 0.25);
    outline-offset: 2px;
  }
}

.welcome-modal-header {
  margin-bottom: 1.5rem;

  .welcome-modal-badge {
    display: inline-block;
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    margin: 0 0 0.5rem;

    color: var(--color-pink-700);

    font-size: clamp(1.25rem, 3.5vw, 1.45rem);
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .welcome-modal-subtitle {
    margin: 0;

    color: var(--color-text);

    font-size: 0.95rem;
    line-height: 1.5;

    strong {
      color: var(--color-pink-600);
      font-weight: 750;
    }
  }
}

.welcome-modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.welcome-modal-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;

  label {
    color: var(--color-pink-700);
    font-size: 0.84rem;
    font-weight: 650;
  }

  input {
    width: 100%;
    min-height: 44px;

    padding: 0.75rem 1rem;

    border: 1px solid var(--color-pink-200);
    border-radius: var(--radius-md);

    background: var(--color-white);
    color: var(--color-text);

    font: inherit;
    font-size: 0.92rem;

    outline: none;
    box-sizing: border-box;

    transition:
      border-color var(--transition-fast),
      box-shadow var(--transition-fast);

    &::placeholder {
      color: var(--color-text-light);
      opacity: 0.75;
    }

    &:hover {
      border-color: var(--color-pink-300);
    }

    &:focus {
      border-color: var(--color-pink-500);
      box-shadow: 0 0 0 3px rgba(170, 93, 120, 0.15);
    }
  }
}

.welcome-modal-submit {
  width: 100%;
  min-height: 46px;

  margin-top: 0.5rem;
  padding: 0.8rem 1.5rem;

  border: 0;
  border-radius: var(--radius-md);

  background: var(--color-pink-500);
  color: var(--color-white);

  font: inherit;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1;

  cursor: pointer;

  box-shadow: var(--shadow-sm);

  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);

  &:hover {
    background: var(--color-pink-600);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid rgba(170, 93, 120, 0.25);
    outline-offset: 2px;
  }
}

.welcome-modal-info {
  p {
    margin: 0 0 1.25rem;
    color: var(--color-text);
    font-size: 0.9rem;
    line-height: 1.6;
  }
}

@media (max-width: 480px) {
  .welcome-modal-card {
    padding: 1.5rem 1.25rem;
    border-radius: var(--radius-lg);
  }

  .welcome-modal-header {
    .welcome-modal-badge {
      font-size: 1.8rem;
    }

    h2 {
      font-size: 1.2rem;
    }

    .welcome-modal-subtitle {
      font-size: 0.88rem;
    }
  }

  .welcome-modal-close {
    top: 0.75rem;
    right: 0.75rem;
  }
}
</style>

