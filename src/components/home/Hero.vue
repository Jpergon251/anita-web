<template>
    <section class="hero">

        <div class="hero-content">

            <span class="hero-eyebrow">
                Rincón de la Esperanza
            </span>

            <h1>
                Papelería creativa
                <span>para tu día a día ✨</span>
            </h1>

            <p>
                Organiza, crea y regala con emoción.
            </p>

            <RouterLink
                :to="{ name: 'shop' }"
                class="hero-button"
            >
                Ver productos
            </RouterLink>

        </div>

    </section>
</template>