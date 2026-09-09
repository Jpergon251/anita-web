<template>
  <main class="contact-page">
    <h1>Contacto</h1>

    <section class="contact-info" aria-label="Canales de contacto">
      <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <Smartphone class="icon" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>

      <a href="mailto:contacto@rincondelaesperanza.com" aria-label="Email">
        <Mail class="icon" aria-hidden="true" />
        <span>Email</span>
      </a>

      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
        <Instagram class="icon" aria-hidden="true" />
        <span>Instagram</span>
      </a>
    </section>

    <section class="contact-form">
      <h2>Envíanos un mensaje</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="name">Nombre</label>
          <input id="name" v-model="name" type="text" placeholder="Tu nombre" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input id="phone" v-model="phone" type="tel" placeholder="+54..." />
        </div>

        <div class="form-group">
          <label for="message">Mensaje</label>
          <textarea id="message" v-model="message" rows="6" placeholder="Escribe tu mensaje..." required />
        </div>

        <button type="submit">Enviar mensaje</button>

        <!-- Punto de integración para envío de mensajes -->
        <p v-if="notice" class="contact-notice">
          {{ notice }}
        </p>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { Smartphone, Mail, Instagram } from 'lucide-vue-next'

const name = ref('')
const email = ref('')
const phone = ref('')
const message = ref('')
const notice = ref('')

function handleSubmit() {
  // TODO: Conectar con API o servicio de mensajería cuando esté disponible en el backend
  const subject = encodeURIComponent(`Consulta de ${name.value}`)
  const body = encodeURIComponent(`Hola, mi nombre es ${name.value} (${phone.value ? 'Tel: ' + phone.value + ' | ' : ''}Email: ${email.value}):\n\n${message.value}`)
  window.location.href = `mailto:contacto@rincondelaesperanza.com?subject=${subject}&body=${body}`
  notice.value = 'Abriendo tu gestor de correo para enviar el mensaje directamente a contacto@rincondelaesperanza.com.'
}
</script>
