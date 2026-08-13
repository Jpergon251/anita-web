# Configuración de Supabase para la tienda

La aplicación usa `products`, `categories`, `profiles` y el bucket público `product-images`. No ejecuta migraciones ni modifica RLS desde el navegador.

## Esquema mínimo

Ejecuta este bloque **solo si las tablas o columnas no existen ya**. Si tu esquema ya existe, compáralo con estos campos y añade únicamente los que falten.

```sql
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  category_id uuid not null references public.categories(id) on delete restrict,
  image_url text,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user', 'admin'))
);
```

## RLS segura

Habilita RLS y ejecuta estas políticas. La función se ejecuta con privilegios de propietario para poder comprobar el rol sin abrir la tabla `profiles` a otros usuarios. No añadas una política que permita a un usuario modificar su propio `role`.

```sql
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer
set search_path = public
as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;

grant execute on function public.is_admin() to anon, authenticated;

-- Ejecuta este bloque para corregir la autorización de productos existente.
-- Elimina solo las políticas de products con estos nombres, no desactiva RLS.
drop policy if exists "public reads active products" on public.products;
drop policy if exists "admins manage products" on public.products;

create policy "public reads active products" on public.products for select
using (is_active = true or public.is_admin());

create policy "admins insert products" on public.products for insert to authenticated
with check (public.is_admin());
create policy "admins update products" on public.products for update to authenticated
using (public.is_admin())
with check (public.is_admin());
create policy "admins delete products" on public.products for delete to authenticated
using (public.is_admin());
create policy "public reads categories" on public.categories for select using (true);
create policy "admins manage categories" on public.categories for all to authenticated
using (public.is_admin()) with check (public.is_admin());
create policy "users read own profile" on public.profiles for select to authenticated using (id = auth.uid());
```

For an existing production database, give the policies different names if ones with these names already exist; inspect and replace equivalent policies deliberately rather than disabling RLS.

### Diagnóstico del error 403

Ejecuta esta consulta en el SQL Editor, sustituyendo el UUID por el usuario con el que inicias sesión. Debe devolver `admin`. Si no devuelve una fila, o devuelve otro rol, el `PATCH` recibirá `403` incluso si la interfaz permite entrar al panel:

```sql
select id, role from public.profiles where id = 'UUID_DEL_USUARIO_DE_AUTH';
```

Las políticas de `UPDATE` necesitan las dos cláusulas: `using` autoriza qué fila existente se puede modificar y `with check` valida el nuevo contenido. Ambas comprueban `public.is_admin()`, que a su vez compara `profiles.id` con `auth.uid()` de la sesión JWT; no se basa en un dato enviado desde Vue.

## Storage

Create a **public** bucket named `product-images` in Storage, then add these policies to `storage.objects`:

```sql
create policy "public reads product images" on storage.objects for select
using (bucket_id = 'product-images');
create policy "admins upload product images" on storage.objects for insert to authenticated
with check (bucket_id = 'product-images' and public.is_admin());
create policy "admins update product images" on storage.objects for update to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());
create policy "admins delete product images" on storage.objects for delete to authenticated
using (bucket_id = 'product-images' and public.is_admin());
```

Create the first admin from Supabase Authentication, then insert its Auth user id into `profiles` with `role = 'admin'` using the SQL editor as a database administrator.

## Recuperación y cambios de cuenta

En **Authentication → URL Configuration** de Supabase, añade las URLs de redirección que uses:

```text
http://localhost:5173/admin/reset-password
https://TU-DOMINIO/admin/reset-password
```

La aplicación utiliza `supabase.auth.resetPasswordForEmail()` para enviar la recuperación y `supabase.auth.updateUser()` para solicitar el cambio de email. El panel exige escribir dos veces la contraseña actual y la verifica con Supabase antes de enviar la solicitud. Mantén activada en **Authentication → Providers → Email** la opción de confirmación de cambio de email: el nuevo email no se hará efectivo hasta que se confirme el mensaje recibido en esa nueva dirección.
