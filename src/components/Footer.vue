<template>
    <footer class="footer">

        <div class="footer-container">

            <!-- BRAND TEXT ONLY -->
            <section class="footer-brand">

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
                        <Pin class="icon" />
                        Argentina
                    </li>

                    <li>
                        <Mail class="icon" />
                        contacto@rincondelaesperanza.com
                    </li>

                    <li>
                        <Smartphone class="icon" />
                        WhatsApp
                    </li>

                    <li>
                        <Instagram class="icon" />
                        Instagram
                    </li>
                </ul>

            </section>

        </div>

        <div class="footer-bottom">
            © 2026 Rincón de la Esperanza · Hecho con
            <Heart class="heart-icon" fill="currentColor" />
        </div>

    </footer>
</template>

<script setup>
import { Pin, Mail, Smartphone, Instagram, Heart } from 'lucide-vue-next'
</script>