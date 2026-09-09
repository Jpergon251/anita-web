<template>
    <section class="categories" aria-labelledby="categories-title">

        <div class="section-heading">

            <span class="eyebrow">
                Descubre
            </span>

            <h2 id="categories-title">
                Nuestras categorías
            </h2>

            <p>
                Encuentra productos creados para organizar,
                regalar y disfrutar de cada detalle.
            </p>

        </div>

        <div
            v-if="displayCategories.length"
            class="categories-carousel-wrapper"
            @mouseenter="stopAutoplay"
            @mouseleave="pauseAndResumeLater(1000)"
            @touchstart.passive="onTouchStart"
            @touchend.passive="onTouchEnd"
        >
            <button
                class="carousel-btn prev"
                type="button"
                aria-label="Categoría anterior"
                @click="manualPrev"
            >
                <ChevronLeft class="icon" aria-hidden="true" />
            </button>

            <div class="carousel-viewport">
                <div
                    ref="trackRef"
                    class="categories-track"
                    :style="trackStyle"
                    @transitionend="onTransitionEnd"
                >
                    <RouterLink
                        v-for="(category, index) in infiniteItems"
                        :key="`${category.slug}-${index}`"
                        :to="{
                            name: 'category',
                            params: {
                                slug: category.slug
                            }
                        }"
                        class="category-card"
                        :tabindex="index >= currentIndex && index < currentIndex + visibleCount ? 0 : -1"
                    >
                        <div class="category-icon-wrap" aria-hidden="true">
                            {{ getCategoryIcon(category) }}
                        </div>

                        <h3 class="category-name">
                            {{ category.name }}
                        </h3>

                        <span class="category-cta">
                            Explorar <span class="cta-arrow" aria-hidden="true">→</span>
                        </span>
                    </RouterLink>
                </div>
            </div>

            <button
                class="carousel-btn next"
                type="button"
                aria-label="Siguiente categoría"
                @click="manualNext"
            >
                <ChevronRight class="icon" aria-hidden="true" />
            </button>
        </div>

        <div v-else-if="loading" class="categories-loading" aria-label="Cargando categorías">
            <span></span>
            <span></span>
            <span></span>
        </div>

        <p v-else class="empty-state">
            Próximamente encontrarás nuestras categorías.
        </p>

    </section>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { getCategories } from '../../services/categories'
import { getCategoryIcon } from '../../utils/categoriesCatalog'

const dbCategories = ref([])
const loading = ref(true)

const trackRef = ref(null)
const cardWidth = ref(260)
const gap = ref(24)
const currentIndex = ref(0)
const disableTransition = ref(false)
const visibleCount = ref(4)

let autoplayTimer = null
let resumeTimeout = null
let touchStartX = 0
let touchStartY = 0

onMounted(async () => {
    try {
        const { data } = await getCategories()
        dbCategories.value = data || []
    } catch {
        dbCategories.value = []
    } finally {
        loading.value = false
        await nextTick()
        initCarousel()
    }
})

    // Use only categories from the database
    const displayCategories = computed(() => {
        // Ensure we have a sorted array for consistent carousel order
        return dbCategories.value.slice().sort((a, b) => a.name.localeCompare(b.name))
    })

// Buffer triple para loop verdaderamente infinito
const infiniteItems = computed(() => {
    const list = displayCategories.value
    if (!list.length) return []
    return [...list, ...list, ...list]
})

const trackStyle = computed(() => {
    const step = cardWidth.value + gap.value
    const offset = currentIndex.value * step
    return {
        transform: `translate3d(-${offset}px, 0, 0)`,
        transition: disableTransition.value
            ? 'none'
            : 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)'
    }
})

function initCarousel() {
    updateDimensions()
    const n = displayCategories.value.length
    if (n > 0) {
        // Comenzamos en el inicio del segundo bloque (índice N)
        disableTransition.value = true
        currentIndex.value = n
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                disableTransition.value = false
                startAutoplay()
            })
        })
    }
    window.addEventListener('resize', handleResize)
}

function updateDimensions() {
    if (trackRef.value && trackRef.value.children.length > 0) {
        const firstCard = trackRef.value.children[0]
        cardWidth.value = firstCard.offsetWidth || 260
        const cs = window.getComputedStyle(trackRef.value)
        gap.value = parseFloat(cs.columnGap || cs.gap) || 24

        const viewportWidth = trackRef.value.parentElement?.offsetWidth || window.innerWidth
        visibleCount.value = Math.max(1, Math.floor(viewportWidth / (cardWidth.value + gap.value)))
    }
}

function handleResize() {
    updateDimensions()
}

function next() {
    currentIndex.value++
}

function prev() {
    currentIndex.value--
}

function manualNext() {
    next()
    pauseAndResumeLater(1500)
}

function manualPrev() {
    prev()
    pauseAndResumeLater(1500)
}

function onTransitionEnd() {
    const n = displayCategories.value.length
    if (n === 0) return

    // Si llegamos o superamos el final del segundo bloque (índice 2N),
    // saltamos instantáneamente al mismo elemento en el bloque central (índice N)
    if (currentIndex.value >= 2 * n) {
        disableTransition.value = true
        currentIndex.value = currentIndex.value - n
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                disableTransition.value = false
            })
        })
    } else if (currentIndex.value < n) {
        // Si retrocedemos antes del bloque central, saltamos hacia adelante
        disableTransition.value = true
        currentIndex.value = currentIndex.value + n
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                disableTransition.value = false
            })
        })
    }
}

// ========================================================
// AUTOPLAY: Se mueve solo hacia la derecha tras 1 segundo de inactividad
// ========================================================
function startAutoplay() {
    stopAutoplay()
    autoplayTimer = setInterval(() => {
        next()
    }, 2200)
}

function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer)
        autoplayTimer = null
    }
    if (resumeTimeout) {
        clearTimeout(resumeTimeout)
        resumeTimeout = null
    }
}

function pauseAndResumeLater(delay = 1200) {
    stopAutoplay()
    resumeTimeout = setTimeout(() => {
        startAutoplay()
    }, delay)
}

// Touch swipe support
function onTouchStart(e) {
    stopAutoplay()
    if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
    }
}

function onTouchEnd(e) {
    if (e.changedTouches && e.changedTouches[0]) {
        const deltaX = e.changedTouches[0].clientX - touchStartX
        const deltaY = e.changedTouches[0].clientY - touchStartY
        if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX < 0) {
                next()
            } else {
                prev()
            }
        }
    }
    pauseAndResumeLater(1500)
}

onUnmounted(() => {
    stopAutoplay()
    window.removeEventListener('resize', handleResize)
})
</script>