<template>
    <footer class="footer">

        <div class="footer-container">

            <!-- BRAND -->
            <section class="footer-brand">

                <h2>Rincón de la Esperanza</h2>

                <p>
                    Papelería creativa y personalizada para regalar,
                    organizar y expresar emociones.
                </p>

            </section>

            <!-- CONTACT -->
            <section class="footer-contact">

                <h3>Contacto</h3>

                <ul>

                    <li>
                        <span class="contact-item">
                            <Pin class="icon" aria-hidden="true" />
                            <span>Argentina</span>
                        </span>
                    </li>

                    <li>
                        <a
                            href="mailto:contacto@rincondelaesperanza.com"
                        >
                            <Mail class="icon" aria-hidden="true" />
                            <span>contacto@rincondelaesperanza.com</span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Smartphone class="icon" aria-hidden="true" />
                            <span>WhatsApp</span>
                        </a>
                    </li>

                    <li>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Instagram class="icon" aria-hidden="true" />
                            <span>Instagram</span>
                        </a>
                    </li>

                </ul>

            </section>

        </div>

        <div class="footer-bottom">

            <p>
                © 2026 Rincón de la Esperanza
            </p>

            <span class="separator">·</span>

            <p class="made-with">
                Hecho con
                <Heart
                    class="heart-icon"
                    fill="currentColor"
                    aria-hidden="true"
                />
            </p>

        </div>

    </footer>
</template>

<script setup>
import {
    Pin,
    Mail,
    Smartphone,
    Instagram,
    Heart
} from 'lucide-vue-next'
</script>