import { supabase } from "../../utils/supabase";
import { slugify } from "./products";

export async function getCategories() {
  return supabase
    .from("categories")
    .select("id, name, slug, description")
    .order("name");
}
export async function getCategoryBySlug(slug) {
  return supabase
    .from("categories")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .maybeSingle();
}
export async function createCategory(category) {
  return supabase.from("categories").insert(category).select().single();
}
export async function updateCategory(id, category) {
  return supabase
    .from("categories")
    .update(category)
    .eq("id", id)
    .select()
    .single();
}
export async function deleteCategory(id) {
  return supabase.from("categories").delete().eq("id", id);
}
export async function countCategoryProducts(id) {
  return supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);
}
export async function getUniqueCategorySlug(name, excludeId) {
  const base = slugify(name) || "categoria";
  let candidate = base,
    number = 2;
  while (true) {
    let query = supabase
      .from("categories")
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (excludeId) query = query.neq("id", excludeId);
    const { data, error } = await query;
    if (error || !data.length) return { slug: candidate, error };
    candidate = `${base}-${number++}`;
  }
}
