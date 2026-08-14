<template>
    <section class="admin-page categories-page">
        <header class="admin-page-header">
            <div>
                <h1>Categorías</h1>
                <p>Organiza los productos de la tienda.</p>
            </div><button class="button" @click="startCreate">Nueva categoría</button>
        </header>
        <form v-if="editing" class="admin-form category-form" @submit.prevent="save">
            <h2>{{ editing.id ? 'Editar categoría' : 'Nueva categoría' }}</h2><label>Nombre<input
                    v-model.trim="editing.name" required @input="slugTouched = false"></label><label>Slug<input
                    v-model.trim="editing.slug" required @input="slugTouched = true"></label><label>Descripción<textarea
                    v-model.trim="editing.description" rows="3"></textarea></label>
            <p v-if="message" class="error-state">{{ message }}</p>
            <div class="form-actions">
                <button type="button" @click="editing = null">Cancelar</button>
                <button type="submit">Guardar</button>
            </div>
        </form>
        <p v-if="loading">Cargando categorías…</p>
        <div v-else class="admin-table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Slug</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="category in categories" :key="category.id">
                        <td data-label="Nombre">{{ category.name }}</td>
                        <td data-label="Slug">{{ category.slug }}</td>
                        <td data-label="Descripción">{{ category.description || '—' }}</td>
                        <td data-label="Acciones" class="table-actions">
                            <button class="link-button" @click="edit(category)">
                                Editar
                            </button>

                            <button class="danger-link" @click="remove(category)">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <p v-if="!categories.length" class="empty-state">Todavía no hay categorías.</p>
        </div>
    </section>
</template>
<script
    setup>    import { ref, watch } from 'vue'; import { countCategoryProducts, createCategory, deleteCategory, getCategories, getUniqueCategorySlug, updateCategory } from '../../services/categories'; const categories = ref([]), loading = ref(true), editing = ref(null), message = ref(''), slugTouched = ref(false); async function load() { const { data } = await getCategories(); categories.value = data || []; loading.value = false } load(); function startCreate() { editing.value = { name: '', slug: '', description: '' }; message.value = ''; slugTouched.value = false } function edit(category) { editing.value = { ...category }; message.value = ''; slugTouched.value = true } watch(() => editing.value?.name, async value => { if (editing.value && value && !slugTouched.value) { const result = await getUniqueCategorySlug(value, editing.value.id); if (!result.error) editing.value.slug = result.slug } }); async function save() { message.value = ''; const result = editing.value.id ? await updateCategory(editing.value.id, editing.value) : await createCategory(editing.value); if (result.error) { message.value = result.error.code === '23505' ? 'Ese slug ya está en uso.' : 'No se pudo guardar la categoría.'; return } editing.value = null; await load() } async function remove(category) { const { count, error } = await countCategoryProducts(category.id); if (error) { alert('No se pudo comprobar la categoría.'); return } if (count) { alert(`No puedes eliminarla: tiene ${count} producto(s) asociado(s).`); return } if (!confirm(`¿Eliminar la categoría “${category.name}”?`)) return; const result = await deleteCategory(category.id); if (result.error) { alert('No se pudo eliminar la categoría.'); return } await load() }</script>
