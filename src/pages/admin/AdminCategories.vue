<template>
  <section class="admin-page categories-page">
    <header class="admin-page-header">
      <div>
        <h1>Categorías</h1>
        <p>Organiza los productos de la tienda.</p>
      </div>

      <button class="button" type="button" @click="startCreate">
        Nueva categoría
      </button>
    </header>

    <div
      v-if="editing"
      class="admin-form-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-form-title"
    >
      <form class="admin-form category-form" @submit.prevent="save">
        <h2 id="category-form-title">
          {{ editing.id ? "Editar categoría" : "Nueva categoría" }}
        </h2>

        <label>
          Nombre
          <input v-model.trim="editing.name" type="text" required />
        </label>

        <label>
          Slug
          <input v-model="editing.slug" type="text" readonly />
          <small>
            El slug se genera automáticamente a partir del nombre.
          </small>
        </label>

        <label>
          Icono (emoji)
          <div class="icon-grid">
            <button
              v-for="icon in stationeryIcons"
              :key="icon"
              type="button"
              class="icon-button"
              :class="{ selected: editing?.icon === icon }"
              @click="selectIcon(icon)"
            >
              {{ icon }}
            </button>
          </div>
        </label>

        <label>
          Descripción
          <textarea v-model.trim="editing.description" rows="3"></textarea>
        </label>

        <p v-if="message" class="error-state">
          {{ message }}
        </p>

        <div class="form-actions">
          <button
            v-if="editing?.id"
            type="button"
            class="danger-link form-danger"
            @click="remove(editing)"
          >
            Eliminar
          </button>
          <button type="button" class="form-cancel" @click="editing = null">
            Cancelar
          </button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>

    <p v-if="loading">Cargando categorías…</p>

    <div v-else class="admin-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Icono</th>
            <th>Nombre</th>
            <th>Slug</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="category in categories" :key="category.id">
            <td data-label="Icono">
              {{ category.icon || getCategoryIcon(category) }}
            </td>
            <td data-label="Nombre">
              {{ category.name }}
            </td>

            <td data-label="Slug">
              {{ category.slug }}
            </td>

            <td data-label="Descripción">
              {{ category.description || "—" }}
            </td>

            <td data-label="Acciones" class="table-actions">
              <button class="link-button" type="button" @click="edit(category)">
                Editar
              </button>

              <button
                class="danger-link"
                type="button"
                @click="remove(category)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="!categories.length" class="empty-state">
        Todavía no hay categorías.
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, watch } from "vue";

import {
  countCategoryProducts,
  createCategory,
  deleteCategory,
  getCategories,
  getUniqueCategorySlug,
  updateCategory,
} from "../../services/categories";
import { getCategoryIcon } from "../../utils/categoriesCatalog";

const categories = ref([]);
const loading = ref(true);
const editing = ref(null);
const stationeryIcons = [
  "✏️",
  "📚",
  "📓",
  "🖍️",
  "🖊️",
  "📖",
  "📒",
  "🗂️",
  "🗒️",
  "📁",
  "🖌️",
  "📎",
  "📐",
  "🧾",
  "📌",
  "🖇️",
  "📂",
  "📏",
  "✂️",
  "📇",
  "🧷",
  "📍",
  "📝",
  "🔖",
  "📋",
  "🖋️",
  "🧮",
  "📬",
  "📦",
  "🎨",
  "🧵",
  "🪡",
  "✨",
  "🎒",
  "🧸",
  "🗓️",
  "📔"

];
function selectIcon(icon) {
  editing.value.icon = icon;
}
const message = ref("");

async function load() {
  const { data } = await getCategories();

  categories.value = data || [];
  loading.value = false;
}

load();

function startCreate() {
  editing.value = {
    name: "",
    slug: "",
    description: "",
    icon: "",
  };
  message.value = "";
}

function edit(category) {
  editing.value = {
    ...category,
  };

  message.value = "";
}

watch(
  () => editing.value?.name,
  async (value) => {
    if (!editing.value) return;

    if (!value?.trim()) {
      editing.value.slug = "";
      return;
    }

    const result = await getUniqueCategorySlug(value, editing.value.id);

    if (!result.error) {
      editing.value.slug = result.slug;
    }
  },
);

async function save() {
  message.value = "";

  const result = editing.value.id
    ? await updateCategory(editing.value.id, editing.value)
    : await createCategory(editing.value);

  if (result.error) {
    message.value =
      result.error.code === "23505"
        ? "Ese slug ya está en uso."
        : "No se pudo guardar la categoría.";

    return;
  }

  editing.value = null;

  await load();
}

async function remove(category) {
  const { count, error } = await countCategoryProducts(category.id);

  if (error) {
    alert("No se pudo comprobar la categoría.");
    return;
  }

  // Las categorías con productos asociados no se pueden eliminar.
  // La comprobación se hace justo antes de borrar para evitar eliminar
  // una categoría que haya recibido productos desde la última carga.
  if (count > 0) {
    alert(`No puedes eliminarla: tiene ${count} producto(s) asociado(s).`);

    return;
  }

  if (!confirm(`¿Eliminar la categoría “${category.name}”?`)) {
    return;
  }

  const result = await deleteCategory(category.id);

  if (result.error) {
    alert("No se pudo eliminar la categoría.");
    return;
  }

  // Si se eliminó desde el formulario de edición, ciérralo también para
  // no dejar visible una categoría que ya no existe.
  if (editing.value?.id === category.id) {
    editing.value = null;
  }

  await load();
}
</script>
