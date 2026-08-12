<template>
    <main class="contact-page">

        <h1>Contacto</h1>

        <section class="contact-info">

            <a
                href=""
                target="_blank"
                rel="noopener noreferrer"
            >
                WhatsApp
            </a>

            <a
                href="mailto:"
            >
                Email
            </a>

        </section>

        <section class="contact-form">

            <h2>Envíanos un mensaje</h2>

            <form>

                <div class="form-group">
                    <label for="name">Nombre</label>

                    <input
                        id="name"
                        type="text"
                        placeholder="Tu nombre"
                    >
                </div>

                <div class="form-group">
                    <label for="email">Email</label>

                    <input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                    >
                </div>

                <div class="form-group">
                    <label for="phone">Teléfono</label>

                    <input
                        id="phone"
                        type="tel"
                        placeholder="+54..."
                    >
                </div>

                <div class="form-group">
                    <label for="message">Mensaje</label>

                    <textarea
                        id="message"
                        rows="6"
                        placeholder="Escribe tu mensaje..."
                    />
                </div>

                <button type="submit">
                    Enviar mensaje
                </button>

            </form>

        </section>

    </main>
</template>

<script setup>
</script>