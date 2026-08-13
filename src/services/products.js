import { supabase } from '../../utils/supabase'

const PUBLIC_FIELDS = 'id, name, slug, description, price, stock, image_url, is_active, created_at, category_id, categories(id, name, slug)'

function queryWithFilters(query, filters = {}) {
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)
  if (filters.minPrice !== '' && filters.minPrice != null) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice !== '' && filters.maxPrice != null) query = query.lte('price', filters.maxPrice)
  if (filters.availability === 'in-stock') query = query.gt('stock', 0)
  if (filters.availability === 'out-of-stock') query = query.lte('stock', 0)
  const orders = { priceAsc: ['price', { ascending: true }], priceDesc: ['price', { ascending: false }], nameAsc: ['name', { ascending: true }], nameDesc: ['name', { ascending: false }], newest: ['created_at', { ascending: false }] }
  const order = orders[filters.sort] || ['created_at', { ascending: false }]
  return query.order(...order)
}

export async function getProducts(filters = {}, includeInactive = false) {
  let query = supabase.from('products').select(PUBLIC_FIELDS)
  if (!includeInactive) query = query.eq('is_active', true)
  return queryWithFilters(query, filters)
}

export async function getProductBySlug(slug, includeInactive = false) {
  let query = supabase.from('products').select(PUBLIC_FIELDS).eq('slug', slug)
  if (!includeInactive) query = query.eq('is_active', true)
  return query.maybeSingle()
}

export async function getProductById(id) { return supabase.from('products').select(PUBLIC_FIELDS).eq('id', id).single() }

export async function getProductsByCategory(categoryId, filters = {}) {
  return getProducts({ ...filters, categoryId })
}

export async function searchProducts(term, filters = {}) {
  const value = term.trim().replace(/[%_,()]/g, '')
  if (!value) return { data: [], error: null }
  let query = supabase.from('products').select(PUBLIC_FIELDS).eq('is_active', true)
    .or(`name.ilike.%${value}%,description.ilike.%${value}%`)
  return queryWithFilters(query, filters)
}

export async function getUniqueSlug(name, excludeId) {
  const base = slugify(name) || 'producto'
  let candidate = base, number = 2
  while (true) {
    let query = supabase.from('products').select('id').eq('slug', candidate).limit(1)
    if (excludeId) query = query.neq('id', excludeId)
    const { data, error } = await query
    if (error) return { slug: candidate, error }
    if (!data.length) return { slug: candidate, error: null }
    candidate = `${base}-${number++}`
  }
}

export function slugify(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export async function createProduct(product) { return supabase.from('products').insert(product).select().single() }
export async function updateProduct(id, product) { return supabase.from('products').update(product).eq('id', id).select().single() }
export async function deleteProduct(id) { return supabase.from('products').delete().eq('id', id) }
export async function toggleProductActive(id, isActive) {
    return supabase
        .from('products')
        .update({ is_active: isActive })
        .eq('id', id)
}

// export async function toggleProductActive(id, isActive) {
  
//   const { data: userData } = await supabase.auth.getUser()
//   console.log('getUser en toggleProductActive:', {
//     userId: userData.user?.id ?? null,
//     email: userData.user?.email ?? null,
//   })
//   const { data: sess } = await supabase.auth.getSession()
//   console.log('session en toggleProductActive:', {
//     hasSession: !!sess.session,
//     userId: sess.session?.user?.id ?? null,
//   })
  
//   return supabase

//     .from('products')
//     .update({ is_active: isActive })
//     .eq('id', id)
//     .select('id, is_active')
//     .single()


// }

export async function uploadProductImage(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false })
  if (error) return { data: null, error }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return { data: { path, url: data.publicUrl }, error: null }
}

export function storagePathFromUrl(url) {
  const marker = '/product-images/'
  const position = (url || '').indexOf(marker)
  return position >= 0 ? url.slice(position + marker.length) : null
}

export async function removeProductImage(url) {
  const path = storagePathFromUrl(url)
  if (!path) return { error: null }
  return supabase.storage.from('product-images').remove([path])
}
