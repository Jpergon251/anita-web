// ============================================================
// Catálogo de categorías para Rincón de la Esperanza
// ============================================================

export const DEFAULT_CATEGORIES = [
  {
    id: 'cat-libretas-a6',
    name: 'Libretas A6',
    slug: 'libretas-a6',
    icon: '📓',
    description: 'Prácticas libretas en tamaño A6 ideales para llevar en el bolso o mochila.'
  },
  {
    id: 'cat-separadores',
    name: 'Separadores / Marcapáginas personalizados',
    slug: 'separadores-marcapaginas-personalizados',
    icon: '🔖',
    description: 'Separadores y marcapáginas con diseños únicos y personalizados.'
  },
  {
    id: 'cat-cuadernos-a4',
    name: 'Cuadernos A4',
    slug: 'cuadernos-a4',
    icon: '📚',
    description: 'Cuadernos en formato A4 con hojas de alta calidad para tus apuntes y proyectos.'
  },
  {
    id: 'cat-cuadernos-infantiles',
    name: 'Cuadernos infantiles',
    slug: 'cuadernos-infantiles',
    icon: '🎨',
    description: 'Diseños lúdicos y tiernos para acompañar a los más pequeños.'
  },
  {
    id: 'cat-agendas-visuales',
    name: 'Agendas visuales',
    slug: 'agendas-visuales',
    icon: '🗓️',
    description: 'Herramientas visuales y estructuradas para organizar el día a día.'
  },
  {
    id: 'cat-recetarios',
    name: 'Recetarios',
    slug: 'recetarios',
    icon: '📖',
    description: 'Para guardar con cariño tus recetas familiares y creaciones de cocina.'
  },
  {
    id: 'cat-cuadernos-tapa-dura',
    name: 'Cuadernos tapa dura',
    slug: 'cuadernos-tapa-dura',
    icon: '📕',
    description: 'Cuadernos resistentes y elegantes con terminaciones artesanales.'
  },
  {
    id: 'cat-lapiceras',
    name: 'Lapiceras',
    slug: 'lapiceras',
    icon: '✏️',
    description: 'Lapiceras y complementos de escritura para acompañar tus cuadernos.'
  },
  {
    id: 'cat-kit-para-llevar',
    name: 'Kit para llevar',
    slug: 'kit-para-llevar',
    icon: '🎒',
    description: 'Sets completos con tus esenciales de papelería listos para transportar.'
  },
  {
    id: 'cat-stickers',
    name: 'Stickers',
    slug: 'stickers',
    icon: '✨',
    description: 'Stickers ilustrados para decorar tus notas, cuadernos y objetos especiales.'
  },
  {
    id: 'cat-planificadores',
    name: 'Planificadores',
    slug: 'planificadores',
    icon: '📋',
    description: 'Planificadores diarios, semanales y mensuales para organizar tus metas.'
  },
  {
    id: 'cat-planificadores-imantados',
    name: 'Planificadores imantados',
    slug: 'planificadores-imantados',
    icon: '🧲',
    description: 'Ideales para heladeras o superficies metálicas, siempre a la vista.'
  }
];

export function getCategoryIcon(category) {
    // If a full category object with an explicit icon is provided, use it directly.
    if (category && typeof category === 'object' && category.icon) {
        return category.icon;
    }
    // Otherwise treat the argument as a name or slug string.
    const nameOrSlug = typeof category === 'string' ? category : (category?.name || category?.slug || '');
    const normalized = String(nameOrSlug).toLowerCase();
    if (normalized.includes('libreta') || normalized.includes('a6')) return '📓';
    if (normalized.includes('separador') || normalized.includes('marcapagina')) return '🔖';
    if (normalized.includes('infantil')) return '🎨';
    if (normalized.includes('tapa dura')) return '📕';
    if (normalized.includes('a4') || normalized.includes('cuaderno')) return '📚';
    if (normalized.includes('agenda')) return '🗓️';
    if (normalized.includes('recetario')) return '📖';
    if (normalized.includes('lapicera')) return '✏️';
    if (normalized.includes('kit')) return '🎒';
    if (normalized.includes('sticker')) return '✨';
    if (normalized.includes('imantad')) return '🧲';
    if (normalized.includes('planificador')) return '📋';
    return '🌸';
}

export function findKnownCategory(slug) {
  return DEFAULT_CATEGORIES.find(c => c.slug === slug);
}

