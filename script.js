/* ==================================================================
   LA TASQUITA DE ZÁRATE — script.js
   Aquí vive TODA la lógica del sitio. El HTML (index.html) solo tiene
   un contenedor vacío <div id="app"></div>; este archivo decide qué
   se dibuja ahí según la pantalla en la que esté el usuario.

   Guardado de datos: se usa Supabase (PostgreSQL en la nube), para
   que el celular del cliente, la tablet de cocina y la laptop del
   admin vean los mismos pedidos y el mismo menú en tiempo real,
   aunque sean dispositivos distintos. Antes de usar este archivo,
   corre base_de_datos.sql en tu proyecto de Supabase y pega tu
   SUPABASE_URL / SUPABASE_ANON_KEY donde se indica más abajo.
   ================================================================== */

const CATEGORY_ORDER = [
  'Entradas', 'Sopas', 'Ensaladas', 'Paellas o Fideuas', 'Pastas',
  'Principales', 'Del Horno a la Leña', 'Pizzas', 'Postres',
];

const TABLES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/* Menú inicial: se guarda en Supabase la primera vez que se abre
   el sitio (si la tabla "platillos" está vacía). Después de eso, el
   panel de administración manda. */
const SEED_ITEMS = [
  ['Entradas', 'Chorizo a la Sidra', 150, ''],
  ['Entradas', 'Carpaccio de Res', 190, '150 g'],
  ['Entradas', 'Carpaccio de Portobello', 160, '150 g'],
  ['Entradas', 'Pulpo a la Gallega', 340, '150 g de pulpo'],
  ['Entradas', 'Tortilla Chorizo o Jamón', 175, '400 g'],
  ['Entradas', 'Cazuelita de Camarón al Chipotle Gratinado', 180, '150 g'],
  ['Entradas', 'Queso Fundido con Chistorra', 165, '200 g total'],
  ['Entradas', 'Papas Bravas', 80, '200 g'],
  ['Entradas', 'Huevos Lucio', 120, '250 g total'],
  ['Entradas', 'Espárragos Fritos', 98, '150 g de espárragos'],
  ['Entradas', 'Croquetas de Jamón Serrano', 115, ''],
  ['Sopas', 'Sopa de Ajo', 95, ''],
  ['Sopas', 'Sopa de Cebolla al Gratín', 130, ''],
  ['Sopas', 'Crema de Calabacín Trufado', 150, ''],
  ['Ensaladas', 'Mixta', 98, '250 g'],
  ['Ensaladas', 'De la Pasión', 150, '200 g'],
  ['Ensaladas', 'Caprese', 138, 'Tomate orgánico y pesto, 280 g'],
  ['Paellas o Fideuas', 'Negro con Aros de Calamar', 280, 'Al horno de leña'],
  ['Paellas o Fideuas', 'Costilla con Chorizo', 299, 'Al horno de leña'],
  ['Paellas o Fideuas', 'Pollo Chilindrón con Garbanzos', 270, 'Al horno de leña'],
  ['Paellas o Fideuas', 'Mariscos', 295, 'Al horno de leña'],
  ['Paellas o Fideuas', 'Mixta "La Tasquita"', 320, 'Al horno de leña'],
  ['Pastas', 'Espagueti con Camarones', 295, '450 g'],
  ['Pastas', 'Espagueti Florentina', 185, '400 g'],
  ['Pastas', 'Espagueti Boloñesa', 185, '450 g'],
  ['Pastas', 'Fettuccini Carbonara', 200, '400 g'],
  ['Pastas', 'Fettuccini con Langosta', 385, '450 g'],
  ['Pastas', 'Lasaña Boloñesa', 200, '400 g'],
  ['Principales', 'Filete de Res Gorgonzola', 350, '250 g de filete'],
  ['Principales', 'Filete de Res en Salsa de Avellanas', 350, '200 g de filete'],
  ['Principales', 'Cachofo de Filete', 350, 'Milaneza rellena de jamón y queso, con papas a la francesa'],
  ['Principales', 'Fabada Asturiana', 290, '400 g'],
  ['Principales', 'Hamburguesa de la Casa', 195, '200 g de carne de filete'],
  ['Principales', 'Tacos de Arrachera', 260, '280 g de arrachera, divididos en 4 tacos'],
  ['Principales', 'Tacos de Lechón', 290, '250 g al horno de leña'],
  ['Principales', 'Lomo de Salmón a la Naranja', 315, '120 g de salmón'],
  ['Principales', 'Lomo de Pescado del Día', 350, '180 g — chile limón, al azafrán, con sidra asturiana o empanizado'],
  ['Principales', 'Camarones Rellenos de Queso de Cabra', 350, 'Con salsa de maracuyá, 8 pzas (16/20)'],
  ['Principales', 'Camarones Rebozados en Frutos Secos', 350, 'Con salsa de naranja, 8 pzas (16/20)'],
  ['Del Horno a la Leña', 'Foccacia de Jamón', 185, ''],
  ['Del Horno a la Leña', 'Foccacia de Provolone', 185, ''],
  ['Del Horno a la Leña', 'Foccaccia de Gulas', 185, ''],
  ['Pizzas', 'Peperoni', 185, ''],
  ['Pizzas', 'Margarita', 190, ''],
  ['Pizzas', 'Hawaiana', 200, ''],
  ['Pizzas', '4 Quesos con Pera', 225, ''],
  ['Pizzas', 'Camarón y Jalapeño', 285, ''],
  ['Pizzas', 'Ranch', 285, 'Chorizo, jalapeño, albondiguitas y elote'],
  ['Pizzas', 'Carnes', 300, 'Jamón, peperoni, chistorra y arrachera'],
  ['Pizzas', 'Burrata y Jamón Serrano', 310, 'Verificar precio en admin'],
  ['Pizzas', 'Clam Chowder y Quesos', 390, 'Almeja, queso y pistaches'],
  ['Pizzas', 'De Arrachera', 290, '180 g'],
  ['Pizzas', 'De Pera y Vainilla', 195, ''],
  ['Postres', 'Tarta de Nuez con Higos', 120, ''],
  ['Postres', 'Volcán de Chocolate', 120, ''],
  ['Postres', 'Flan de Pistache', 120, ''],
  ['Postres', 'Helado de Turrón', 130, ''],
  ['Postres', 'Créeme Brûlée', 95, ''],
  ['Postres', 'Tejas de Almendra', 85, ''],
  ['Postres', 'Pastel de Elote con Helado de Vainilla', 120, ''],
].map(([category, name, price, description], i) => ({
  id: `m${i + 1}`, category, name, price, description, available: true,
}));

/* ==================================================================
   ICONOS — SVG en línea, sin depender de librerías externas
   ================================================================== */
const ICONS = {
  arrowLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><polyline points="9 18 15 12 9 6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><polyline points="20 6 9 17 4 12"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  chef: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><path d="M6 13.87A4 4 0 017.4 6a5 5 0 018.2 0 4 4 0 011.4 7.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.6 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1Z"/></svg>',
  qr: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><line x1="14" y1="14" x2="14" y2="14.01"/><line x1="21" y1="14" x2="21" y2="14.01"/><line x1="14" y1="21" x2="14" y2="21.01"/><line x1="21" y1="21" x2="21" y2="21.01"/></svg>',
  receipt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><path d="M4 2h16v20l-3-2-3 2-3-2-3 2-3-2-1 2Z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>',
  trending: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="{s}" height="{s}"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
};
function ic(name, size) {
  return (ICONS[name] || '').split('{s}').join(size || 18);
}

/* ==================================================================
   CONEXIÓN A SUPABASE
   ------------------------------------------------------------------
   1. Crea tu proyecto gratis en https://supabase.com
   2. Corre el archivo base_de_datos.sql en el "SQL Editor" de tu
      proyecto (crea las tablas "platillos" y "pedidos").
   3. Ve a Project Settings → Data API y copia tu "Project URL"
      y tu clave "anon public" (NUNCA la "service_role").
   4. Pégalas abajo, reemplazando los dos textos "PON-AQUI-...".
   ================================================================== */
const SUPABASE_URL = 'https://gzthhlxowzvbybreygsz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MzP7h6tDWVijMaCWI8pIaw_Asz8f9lF';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});

/* ==================================================================
   GUARDADO DE DATOS (Supabase, con caché en memoria)
   ------------------------------------------------------------------
   Todas las pantallas (renderKitchen, renderBillModal, etc.) leen el
   menú y los pedidos de forma SÍNCRONA con loadMenu()/loadOrders(),
   igual que en la versión de localStorage, para no tener que romper
   ni reescribir esas funciones. Lo que cambia es que ahora esa
   "fuente de la verdad" se llena desde Supabase al arrancar la app
   y se mantiene al día en tiempo real (ver subscribeRealtime más
   abajo), en vez de leerse directo del navegador.
   ================================================================== */
let ordersCache = [];
let waitersCache = [];
let currentWaiterId = localStorage.getItem('tasquita_waiter_id') || null;
let flashingTables = new Set();
let notifyAudioCtx = null;

/* Sonido corto (dos "dings") para avisar al mesero que llegó un
   pedido nuevo. Se genera con el navegador, sin archivos externos. */
function playNotificationSound() {
  try {
    if (!notifyAudioCtx) notifyAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (notifyAudioCtx.state === 'suspended') notifyAudioCtx.resume();
    const ctx = notifyAudioCtx;
    const now = ctx.currentTime;
    [0, 0.16].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.35, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + offset);
      osc.stop(now + offset + 0.2);
    });
  } catch (e) {}
}

/* Marca una mesa para que destelle unos segundos en la pantalla del
   mesero, para llamar la atención sobre el pedido nuevo. */
function flashTable(tableNum) {
  flashingTables.add(tableNum);
  render();
  setTimeout(() => {
    flashingTables.delete(tableNum);
    render();
  }, 4000);
}

/* Lee un archivo de imagen elegido por el admin, lo reduce a un
   ancho máximo y lo comprime a JPEG, y devuelve el resultado como
   "data URL" (texto) listo para guardarse en Supabase. Así no hace
   falta configurar un servicio externo de almacenamiento de archivos. */
function readAndCompressImage(file, maxWidth = 640, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function rowToMenuItem(row) {
  return {
    id: row.id,
    category: row.category,
    name: row.name,
    price: Number(row.price),
    description: row.description || '',
    available: row.available,
    image: row.image || '',
  };
}
function rowToOrder(row) {
  return {
    id: row.id,
    table: row.table_number,
    items: row.items,
    payment: row.payment,
    status: row.status,
    paid: !!row.paid,
    waiterId: row.waiter_id || null,
    createdAt: Number(row.created_at),
  };
}
function rowToWaiter(row) {
  return { id: row.id, name: row.name };
}

function loadMenu() {
  return state.menu;
}
function loadOrders() {
  return ordersCache;
}
function loadWaiters() {
  return waitersCache;
}
function waiterLabel(id) {
  if (!id) return '';
  const w = waitersCache.find((x) => x.id === id);
  return w ? `${w.name} (${w.id})` : id;
}

async function insertMenuItemDB(item) {
  const { error } = await sb.from('platillos').insert(item);
  if (error) console.error('Error al agregar platillo en Supabase:', error);
}
async function updateMenuItemDB(id, fields) {
  const { error } = await sb.from('platillos').update(fields).eq('id', id);
  if (error) console.error('Error al actualizar platillo en Supabase:', error);
}
async function deleteMenuItemDB(id) {
  const { error } = await sb.from('platillos').delete().eq('id', id);
  if (error) console.error('Error al borrar platillo en Supabase:', error);
}
async function insertOrderDB(order) {
  const { error } = await sb.from('pedidos').insert({
    id: order.id,
    table_number: order.table,
    items: order.items,
    payment: order.payment,
    status: order.status,
    created_at: order.createdAt,
  });
  if (error) console.error('Error al guardar pedido en Supabase:', error);
}
async function updateOrderStatusDB(id, status) {
  const { error } = await sb.from('pedidos').update({ status }).eq('id', id);
  if (error) console.error('Error al actualizar pedido en Supabase:', error);
}
async function markTablePaidDB(tableNum, waiterId) {
  const { error } = await sb.from('pedidos').update({ paid: true, waiter_id: waiterId }).eq('table_number', tableNum);
  if (error) console.error('Error al marcar la mesa como cobrada en Supabase:', error);
}
async function insertWaiterDB(waiter) {
  const { error } = await sb.from('meseros').insert(waiter);
  if (error) console.error('Error al agregar mesero en Supabase:', error);
}
async function updateWaiterDB(id, fields) {
  const { error } = await sb.from('meseros').update(fields).eq('id', id);
  if (error) console.error('Error al actualizar mesero en Supabase:', error);
}
async function deleteWaiterDB(id) {
  const { error } = await sb.from('meseros').delete().eq('id', id);
  if (error) console.error('Error al borrar mesero en Supabase:', error);
}

/* ---------- Fusionar cambios en tiempo real dentro de la caché ---------- */
function upsertLocalMenuItem(row) {
  const item = rowToMenuItem(row);
  const idx = state.menu.findIndex((m) => m.id === item.id);
  if (idx > -1) state.menu[idx] = item;
  else state.menu.push(item);
}
function removeLocalMenuItem(id) {
  state.menu = state.menu.filter((m) => m.id !== id);
}
function upsertLocalOrder(row) {
  const order = rowToOrder(row);
  const idx = ordersCache.findIndex((o) => o.id === order.id);
  if (idx > -1) ordersCache[idx] = order;
  else ordersCache.push(order);
}
function removeLocalOrder(id) {
  ordersCache = ordersCache.filter((o) => o.id !== id);
}
function upsertLocalWaiter(row) {
  const w = rowToWaiter(row);
  const idx = waitersCache.findIndex((x) => x.id === w.id);
  if (idx > -1) waitersCache[idx] = w;
  else waitersCache.push(w);
}
function removeLocalWaiter(id) {
  waitersCache = waitersCache.filter((w) => w.id !== id);
}

/* ==================================================================
   FUNCIONES DE AYUDA
   ================================================================== */
function money(n) {
  return `$${Number(n).toLocaleString('es-MX')}`;
}
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return `${h} h ${m % 60} min`;
}
function orderTotal(order) {
  return order.items.reduce((s, it) => s + it.price * it.qty, 0);
}
function aggregateSales(orders) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();
  const buckets = { day: [], month: [], year: [] };
  orders.forEach((o) => {
    if (o.createdAt >= startOfDay) buckets.day.push(o);
    if (o.createdAt >= startOfMonth) buckets.month.push(o);
    if (o.createdAt >= startOfYear) buckets.year.push(o);
  });
  function summarize(list) {
    const revenue = list.reduce((s, o) => s + orderTotal(o), 0);
    const dishCounts = {};
    list.forEach((o) => o.items.forEach((it) => {
      dishCounts[it.name] = (dishCounts[it.name] || 0) + it.qty;
    }));
    const topDishes = Object.entries(dishCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const bills = [...list].sort((a, b) => b.createdAt - a.createdAt);
    return { revenue, orderCount: list.length, topDishes, bills };
  }
  return { day: summarize(buckets.day), month: summarize(buckets.month), year: summarize(buckets.year) };
}

/* ==================================================================
   ESTADO DE LA APLICACIÓN
   Todo lo que cambia mientras el usuario navega vive aquí.
   ================================================================== */
const state = {
  view: 'home',          // home | tablePicker | customer | kitchen | admin
  table: null,
  menu: [],
  cart: [],               // [{itemId, name, price, qty, notes}]
  activeCategory: '',
  modalItemId: null,      // id del platillo abierto en el modal de agregar
  cartOpen: false,
  billOpen: false,
  confirmedOrder: null,
  adminSection: 'menu',   // menu | sales
  editingId: null,
  addingCat: null,
  editingWaiterId: null,
  addingWaiter: false,
  salesTab: 'day',
  submitting: false,
};
let selectedPayment = 'efectivo';

function setState(patch) {
  Object.assign(state, patch);
  render();
}

/* ==================================================================
   LOGO (reutilizado en varias pantallas)
   ================================================================== */
function logoHtml(size) {
  const s = size || 40;
  return `
    <div class="logo">
      <div class="logo-circle" style="width:${s}px;height:${s}px">${ic('chef', Math.round(s * 0.45))}</div>
      <div>
        <div class="logo-text-main" style="font-size:${Math.round(s * 0.42)}px">La Tasquita</div>
        <div class="logo-text-sub" style="font-size:${Math.round(s * 0.22)}px">DE ZÁRATE</div>
      </div>
    </div>`;
}

/* ==================================================================
   PANTALLA: INICIO
   ================================================================== */
function renderHome() {
  return `
    <div class="home-screen">
      <div class="home-logo">${logoHtml(64)}</div>
      <div class="role-list">
        <button class="role-btn role-btn--primary" data-action="go-customer">
          <span>${ic('qr', 22)} Ordenar desde mi mesa</span>
          ${ic('chevronRight', 20)}
        </button>
        <button class="role-btn role-btn--outline" data-action="go-kitchen">
          <span>${ic('chef', 22)} Pantalla de cocina</span>
          ${ic('chevronRight', 20)}
        </button>
        <button class="role-btn role-btn--outline" data-action="go-waiter">
          <span>${ic('receipt', 22)} Cuentas por mesa (mesero)</span>
          ${ic('chevronRight', 20)}
        </button>
        <button class="role-btn role-btn--ghost" data-action="go-admin">
          <span>${ic('settings', 22)} Panel de administración</span>
          ${ic('chevronRight', 20)}
        </button>
      </div>
      <p class="home-note">En producción, cada mesa tendría su propio código QR que abre directo la vista de "Ordenar" con el número de mesa incluido.</p>
    </div>`;
}

/* ==================================================================
   PANTALLA: SELECCIÓN DE MESA
   ================================================================== */
function renderTablePicker() {
  return `
    <div class="table-picker">
      <button class="back-link" data-action="go-home">${ic('arrowLeft', 18)} Volver</button>
      <h1>¿En qué mesa estás?</h1>
      <p>Simula haber escaneado el QR de tu mesa</p>
      <div class="table-grid">
        ${TABLES.map((t) => `<button class="table-btn" data-action="pick-table" data-table="${t}">${t}</button>`).join('')}
      </div>
    </div>`;
}

/* ==================================================================
   PANTALLA: CLIENTE (MENÚ)
   ================================================================== */
function renderCustomer() {
  const categories = CATEGORY_ORDER.filter((c) => state.menu.some((m) => m.category === c));
  if (!state.activeCategory) state.activeCategory = categories[0] || '';
  const items = state.menu.filter((m) => m.category === state.activeCategory && m.available);
  const cartTotal = state.cart.reduce((s, c) => s + c.price * c.qty, 0);

  return `
    <div class="customer-screen">
      <div class="customer-header">
        <div class="customer-header-row">
          <button class="header-link" data-action="go-home">${ic('arrowLeft', 16)} Salir</button>
          <span class="header-label">Mesa ${state.table}</span>
          <button class="header-link" data-action="open-bill">${ic('receipt', 16)} Mi cuenta</button>
        </div>
        ${logoHtml(34)}
        <div class="category-tabs">
          ${categories.map((c) => `
            <button class="category-tab ${c === state.activeCategory ? 'active' : ''}" data-action="set-category" data-cat="${c}">${c}</button>
          `).join('')}
        </div>
      </div>

      <div class="item-list">
        ${items.length === 0 ? '<p class="empty-note">No hay platillos disponibles en esta categoría.</p>' : ''}
        ${items.map((item) => `
          <button class="item-card" data-action="open-item-modal" data-id="${item.id}">
            ${item.image ? `<img class="item-card-img" src="${item.image}" alt="${item.name}" />` : ''}
            <div class="item-card-info">
              <p class="item-name">${item.name}</p>
              ${item.description ? `<p class="item-desc">${item.description}</p>` : ''}
              <p class="item-price">${money(item.price)}</p>
            </div>
            <div class="item-add-btn">${ic('plus', 16)}</div>
          </button>
        `).join('')}
      </div>

      ${state.cart.length > 0 ? `
        <button class="cart-bar" data-action="open-cart">
          <span>${ic('cart', 18)} ${state.cart.length} platillo${state.cart.length > 1 ? 's' : ''}</span>
          <span>${money(cartTotal)}</span>
        </button>
      ` : ''}
    </div>

    ${state.modalItemId ? renderItemModal() : ''}
    ${state.cartOpen ? renderCartDrawer() : ''}
    ${state.billOpen ? renderBillModal() : ''}
    ${state.confirmedOrder ? renderConfirmModal() : ''}
  `;
}

function renderItemModal() {
  const item = state.menu.find((m) => m.id === state.modalItemId);
  if (!item) return '';
  return `
    <div class="modal-overlay" data-action="overlay-close-item">
      <div class="modal-box" data-action="modal-noop">
        <div class="modal-header">
          <h3 class="modal-title">${item.name}</h3>
          <button class="modal-close" data-action="close-item-modal">${ic('x', 20)}</button>
        </div>
        ${item.image ? `<img class="modal-img" src="${item.image}" alt="${item.name}" />` : ''}
        ${item.description ? `<p class="modal-desc">${item.description}</p>` : ''}
        <p class="modal-price">${money(item.price)} c/u</p>

        <div class="qty-row">
          <span>Cantidad</span>
          <div class="qty-controls">
            <button class="qty-btn" data-action="modal-qty-dec">${ic('minus', 14)}</button>
            <span class="qty-value" id="modalQty">1</span>
            <button class="qty-btn" data-action="modal-qty-inc">${ic('plus', 14)}</button>
          </div>
        </div>

        <label class="field-label">Notas para cocina (opcional)</label>
        <textarea class="notes-input" id="modalNotes" placeholder="Ej. sin cebolla, alergia a nueces, término medio..."></textarea>

        <button class="btn-primary" data-action="add-to-cart" data-id="${item.id}">Agregar</button>
      </div>
    </div>`;
}

function renderCartDrawer() {
  const total = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
  return `
    <div class="modal-overlay" data-action="overlay-close-cart">
      <div class="modal-box" data-action="modal-noop">
        <div class="modal-header">
          <h3 class="modal-title">Tu pedido</h3>
          <button class="modal-close" data-action="close-cart">${ic('x', 20)}</button>
        </div>

        ${state.cart.length === 0 ? '<p class="modal-desc">Aún no has agregado platillos.</p>' : `
          <div class="cart-items">
            ${state.cart.map((c, idx) => `
              <div class="cart-item-row">
                <div>
                  <p style="margin:0;font-size:14px;font-weight:500">${c.qty}× ${c.name}</p>
                  ${c.notes ? `<p class="cart-item-note">Nota: ${c.notes}</p>` : ''}
                </div>
                <div style="display:flex;align-items:center;gap:10px">
                  <span style="font-size:14px">${money(c.price * c.qty)}</span>
                  <button class="icon-btn" data-action="remove-cart-item" data-idx="${idx}" style="color:var(--red)">${ic('trash', 16)}</button>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="cart-total-row"><span>Total</span><span>${money(total)}</span></div>
          <p class="field-label">¿Cómo vas a pagar?</p>
          <div class="payment-options">
            <button class="payment-btn selected" data-action="select-payment" data-method="efectivo">Efectivo en caja</button>
            <button class="payment-btn" data-action="select-payment" data-method="terminal">Terminal en caja</button>
          </div>
          <button class="btn-navy" data-action="submit-order" ${state.submitting ? 'disabled' : ''}>${state.submitting ? 'Enviando...' : 'Enviar pedido a cocina'}</button>
        `}
      </div>
    </div>`;
}

function renderBillModal() {
  const orders = loadOrders().filter((o) => o.table === state.table && !o.paid);
  const total = orders.reduce((s, o) => s + orderTotal(o), 0);
  const statusLabel = { pending: 'Pendiente', preparing: 'En preparación', ready: 'Listo', delivered: 'Entregado' };
  return `
    <div class="modal-overlay" data-action="overlay-close-bill">
      <div class="modal-box" data-action="modal-noop">
        <div class="modal-header">
          <h3 class="modal-title">Cuenta — Mesa ${state.table}</h3>
          <button class="modal-close" data-action="close-bill">${ic('x', 20)}</button>
        </div>
        ${orders.length === 0 ? '<p class="modal-desc">Aún no has enviado ningún pedido.</p>' : `
          <div class="cart-items">
            ${orders.map((o) => `
              <div class="bill-order-block">
                <p class="bill-order-meta">Pedido de las ${new Date(o.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} · ${statusLabel[o.status] || o.status}</p>
                ${o.items.map((it) => `<div class="bill-order-line"><span>${it.qty}× ${it.name}</span><span>${money(it.price * it.qty)}</span></div>`).join('')}
              </div>
            `).join('')}
          </div>
        `}
        <div class="bill-total-row"><span>Total consumido</span><span>${money(total)}</span></div>
        <p class="bill-hint">Muéstrale esta pantalla al mesero para pagar en caja.</p>
      </div>
    </div>`;
}

function renderConfirmModal() {
  return `
    <div class="modal-overlay">
      <div class="confirm-box">
        <div class="confirm-icon">${ic('check', 26)}</div>
        <h3>¡Pedido enviado!</h3>
        <p>Tu pedido ya está en cocina. Puedes seguir ordenando o revisar tu cuenta cuando quieras.</p>
        <button class="btn-navy" data-action="close-confirm">Entendido</button>
      </div>
    </div>`;
}

/* ==================================================================
   PANTALLA: COCINA
   ================================================================== */
const STATUS_META = {
  pending: { label: 'Pendiente', color: 'var(--red)', next: 'preparing', nextLabel: 'Iniciar' },
  preparing: { label: 'En preparación', color: 'var(--amber)', next: 'ready', nextLabel: 'Listo' },
  ready: { label: 'Listo', color: 'var(--green)', next: 'delivered', nextLabel: 'Entregado' },
};

function renderKitchen() {
  const orders = loadOrders().filter((o) => o.status !== 'delivered').sort((a, b) => a.createdAt - b.createdAt);
  const columns = ['pending', 'preparing', 'ready'];

  return `
    <div class="kitchen-screen">
      <div class="kitchen-topbar">
        <button class="back-link" data-action="go-home">${ic('arrowLeft', 16)} Salir</button>
        <span class="kitchen-topbar-center">${ic('chef', 18)} Cocina — se actualiza sola</span>
        <span class="kitchen-topbar-count">${orders.length} activos</span>
      </div>
      <div class="kitchen-columns">
        ${columns.map((col) => {
          const colOrders = orders.filter((o) => o.status === col);
          return `
            <div class="kitchen-col">
              <div class="kitchen-col-header">
                <span class="status-dot" style="background:${STATUS_META[col].color}"></span>
                <span class="kitchen-col-title">${STATUS_META[col].label}</span>
                <span class="kitchen-col-count">${colOrders.length}</span>
              </div>
              ${colOrders.length === 0 ? '<p class="kitchen-empty">Sin pedidos</p>' : colOrders.map((o) => `
                <div class="order-card">
                  <div class="order-card-top">
                    <span class="order-table-label">Mesa ${o.table}</span>
                    <span class="order-time">${ic('clock', 12)} ${timeAgo(o.createdAt)}</span>
                  </div>
                  ${o.items.map((it) => `
                    <div class="order-item-line"><strong>${it.qty}×</strong> ${it.name}</div>
                    ${it.notes ? `<div class="order-item-note">↳ ${it.notes}</div>` : ''}
                  `).join('')}
                  <button class="order-advance-btn" style="background:${STATUS_META[col].color}" data-action="kitchen-advance" data-id="${o.id}" data-next="${STATUS_META[col].next}">
                    ${STATUS_META[col].nextLabel}
                  </button>
                </div>
              `).join('')}
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ==================================================================
   PANTALLA: CUENTAS POR MESA (mesero)
   Muestra cada mesa con pedidos abiertos, su total y el método de
   pago que eligió el cliente (efectivo en caja o terminal en caja).
   ================================================================== */
const PAYMENT_LABEL = { efectivo: 'Efectivo en caja', terminal: 'Terminal en caja' };
const WAITER_STATUS_LABEL = { pending: 'Pendiente', preparing: 'En preparación', ready: 'Listo', delivered: 'Entregado' };

function renderWaiter() {
  if (!currentWaiterId) {
    const waiters = loadWaiters();
    return `
      <div class="kitchen-screen">
        <div class="kitchen-topbar">
          <button class="back-link" data-action="go-home">${ic('arrowLeft', 16)} Salir</button>
          <span class="kitchen-topbar-center">${ic('receipt', 18)} Cuentas por mesa</span>
          <span></span>
        </div>
        <div class="waiter-id-box">
          <p class="waiter-id-label">¿Quién eres?</p>
          <p class="bill-hint" style="margin-top:0;margin-bottom:12px">Elige tu nombre de la lista. Se queda guardado en este dispositivo.</p>
          ${waiters.length === 0
            ? '<p class="empty-note">Todavía no hay meseros registrados. Pídele al admin que los agregue en Panel de administración → Meseros.</p>'
            : `<div class="waiter-pick-list">
                ${waiters.map((w) => `
                  <button class="waiter-pick-btn" data-action="pick-waiter" data-id="${w.id}">${w.name}</button>
                `).join('')}
              </div>`}
        </div>
      </div>`;
  }

  const orders = loadOrders().filter((o) => !o.paid);
  const byTable = {};
  orders.forEach((o) => {
    if (!byTable[o.table]) byTable[o.table] = [];
    byTable[o.table].push(o);
  });
  const tables = Object.keys(byTable).map(Number).sort((a, b) => a - b);

  return `
    <div class="kitchen-screen">
      <div class="kitchen-topbar">
        <button class="back-link" data-action="go-home">${ic('arrowLeft', 16)} Salir</button>
        <span class="kitchen-topbar-center">${ic('receipt', 18)} Cuentas por mesa</span>
        <span class="kitchen-topbar-count">${tables.length} mesa${tables.length !== 1 ? 's' : ''} activa${tables.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="waiter-session-row">
        <span>Mesero: <strong>${waiterLabel(currentWaiterId)}</strong></span>
        <button class="link-btn" data-action="change-waiter-id">Cambiar</button>
      </div>
      ${tables.length === 0 ? '<p class="kitchen-empty">No hay mesas con pedidos abiertos.</p>' : `
        <div class="waiter-list">
          ${tables.map((t) => {
            const tOrders = byTable[t].sort((a, b) => a.createdAt - b.createdAt);
            const total = tOrders.reduce((s, o) => s + orderTotal(o), 0);
            const methods = [...new Set(tOrders.map((o) => o.payment))];
            return `
              <div class="order-card waiter-card ${flashingTables.has(t) ? 'waiter-card-flash' : ''}">
                <div class="order-card-top">
                  <span class="order-table-label">Mesa ${t}</span>
                  <span class="waiter-total">${money(total)}</span>
                </div>
                <div class="waiter-payment-row">
                  ${methods.map((m) => `<span class="payment-pill">${PAYMENT_LABEL[m] || m}</span>`).join('')}
                </div>
                ${tOrders.map((o) => `
                  <div class="order-item-line" style="display:flex;justify-content:space-between">
                    <span>${new Date(o.createdAt).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} · ${WAITER_STATUS_LABEL[o.status] || o.status}</span>
                    <span>${money(orderTotal(o))}</span>
                  </div>
                `).join('')}
                <button class="order-advance-btn" style="background:var(--green-color, #4c7a5c)" data-action="waiter-clear-table" data-table="${t}">
                  Marcar mesa como cobrada
                </button>
              </div>`;
          }).join('')}
        </div>
      `}
    </div>`;
}

/* ==================================================================
   PANTALLA: ADMINISTRACIÓN
   ================================================================== */
function renderAdmin() {
  const categories = CATEGORY_ORDER.filter((c) => state.menu.some((m) => m.category === c));
  return `
    <div class="admin-screen">
      <div class="admin-topbar">
        <button class="back-link" data-action="go-home" style="color:var(--charcoal)">${ic('arrowLeft', 16)} Salir</button>
        <span class="admin-topbar-center">${ic('settings', 18)} Panel de administración</span>
        <span class="admin-topbar-count">${state.menu.length} platillos</span>
      </div>

      <div class="admin-tabs">
        <button class="admin-tab ${state.adminSection === 'menu' ? 'active' : ''}" data-action="admin-section" data-section="menu">Menú</button>
        <button class="admin-tab ${state.adminSection === 'waiters' ? 'active' : ''}" data-action="admin-section" data-section="waiters">${ic('receipt', 14)} Meseros</button>
        <button class="admin-tab ${state.adminSection === 'sales' ? 'active' : ''}" data-action="admin-section" data-section="sales">${ic('trending', 14)} Ventas</button>
      </div>

      ${state.adminSection === 'sales' ? renderSalesReport() : state.adminSection === 'waiters' ? renderAdminWaiters() : categories.map((cat) => renderAdminCategory(cat)).join('')}
    </div>`;
}

function renderAdminCategory(cat) {
  const items = state.menu.filter((m) => m.category === cat);
  return `
    <div class="category-block">
      <h3>${cat}</h3>
      <div class="menu-list">
        ${items.map((item) => {
          if (state.editingId === item.id) {
            return `
              <div class="menu-row">
                <div class="menu-row-edit">
                  <input class="form-input" id="editName" value="${item.name.replace(/"/g, '&quot;')}" placeholder="Nombre" />
                  <input class="form-input" id="editPrice" type="number" value="${item.price}" placeholder="Precio" />
                  <input class="form-input" id="editDesc" value="${(item.description || '').replace(/"/g, '&quot;')}" placeholder="Descripción" />
                  <div class="admin-img-row">
                    ${item.image ? `
                      <img class="admin-img-preview" src="${item.image}" alt="" />
                      <button class="link-btn" data-action="admin-remove-image" data-id="${item.id}" type="button">Quitar imagen</button>
                    ` : '<span class="bill-hint" style="margin:0">Sin imagen todavía</span>'}
                  </div>
                  <input class="form-input" id="editImage" type="file" accept="image/*" />
                  <div class="edit-actions">
                    <button class="btn-navy" data-action="admin-edit-save" data-id="${item.id}">Guardar</button>
                    <button class="btn-outline" data-action="admin-edit-cancel">Cancelar</button>
                  </div>
                </div>
              </div>`;
          }
          return `
            <div class="menu-row ${item.available ? '' : 'unavailable'}">
              <div class="menu-row-view">
                ${item.image ? `<img class="admin-img-thumb" src="${item.image}" alt="" />` : ''}
                <div class="menu-row-info">
                  <p class="menu-row-name">${item.name}</p>
                  ${item.description ? `<p class="menu-row-desc">${item.description}</p>` : ''}
                </div>
                <span class="menu-row-price">${money(item.price)}</span>
                <button class="availability-pill ${item.available ? 'available' : 'unavailable'}" data-action="admin-toggle-avail" data-id="${item.id}">
                  ${item.available ? 'Disponible' : 'Agotado'}
                </button>
                <button class="icon-btn" data-action="admin-edit-start" data-id="${item.id}">${ic('pencil', 15)}</button>
                <button class="icon-btn" style="color:var(--red)" data-action="admin-delete" data-id="${item.id}">${ic('trash', 15)}</button>
              </div>
            </div>`;
        }).join('')}
      </div>

      ${state.addingCat === cat ? `
        <div class="add-item-form">
          <input class="form-input" id="newItemName" placeholder="Nombre del platillo" />
          <input class="form-input" id="newItemPrice" type="number" placeholder="Precio" />
          <input class="form-input" id="newItemDesc" placeholder="Descripción (opcional)" />
          <input class="form-input" id="newItemImage" type="file" accept="image/*" />
          <div class="add-actions">
            <button class="btn-navy" data-action="admin-add-save" data-cat="${cat}">Agregar</button>
            <button class="btn-outline" data-action="admin-add-cancel">Cancelar</button>
          </div>
        </div>
      ` : `
        <button class="add-item-link" data-action="admin-add-start" data-cat="${cat}">${ic('plus', 14)} Agregar platillo a ${cat}</button>
      `}
    </div>`;
}

function renderAdminWaiters() {
  const waiters = loadWaiters();
  return `
    <div class="category-block">
      <h3>Meseros</h3>
      <div class="menu-list">
        ${waiters.length === 0 ? '<p class="empty-note">Aún no has agregado ningún mesero.</p>' : waiters.map((w) => {
          if (state.editingWaiterId === w.id) {
            return `
              <div class="menu-row">
                <div class="menu-row-edit">
                  <input class="form-input" id="editWaiterName" value="${w.name.replace(/"/g, '&quot;')}" placeholder="Nombre" />
                  <div class="edit-actions">
                    <button class="btn-navy" data-action="admin-waiter-edit-save" data-id="${w.id}">Guardar</button>
                    <button class="btn-outline" data-action="admin-waiter-edit-cancel">Cancelar</button>
                  </div>
                </div>
              </div>`;
          }
          return `
            <div class="menu-row">
              <div class="menu-row-view">
                <div class="menu-row-info">
                  <p class="menu-row-name">${w.name}</p>
                  <p class="menu-row-desc">${w.id}</p>
                </div>
                <button class="icon-btn" data-action="admin-waiter-edit-start" data-id="${w.id}">${ic('pencil', 15)}</button>
                <button class="icon-btn" style="color:var(--red)" data-action="admin-waiter-delete" data-id="${w.id}">${ic('trash', 15)}</button>
              </div>
            </div>`;
        }).join('')}
      </div>

      ${state.addingWaiter ? `
        <div class="add-item-form">
          <input class="form-input" id="newWaiterId" placeholder="ID (ej. ID-1)" />
          <input class="form-input" id="newWaiterName" placeholder="Nombre del mesero" />
          <div class="add-actions">
            <button class="btn-navy" data-action="admin-waiter-add-save">Agregar</button>
            <button class="btn-outline" data-action="admin-waiter-add-cancel">Cancelar</button>
          </div>
        </div>
      ` : `
        <button class="add-item-link" data-action="admin-waiter-add-start">${ic('plus', 14)} Agregar mesero</button>
      `}
    </div>`;
}

function renderSalesReport() {
  const orders = loadOrders();
  const stats = aggregateSales(orders);
  const cards = [
    { key: 'day', label: 'Hoy', icon: 'clock' },
    { key: 'month', label: 'Este mes', icon: 'calendar' },
    { key: 'year', label: 'Este año', icon: 'trending' },
  ];
  const current = stats[state.salesTab];
  const currentLabel = cards.find((c) => c.key === state.salesTab).label;

  return `
    <div>
      <div class="sales-cards">
        ${cards.map((c) => `
          <button class="sales-card ${state.salesTab === c.key ? 'active' : ''}" data-action="sales-tab" data-tab="${c.key}">
            ${ic(c.icon, 18)}
            <p class="sales-card-label">${c.label}</p>
            <p class="sales-card-value">${money(stats[c.key].revenue)}</p>
          </button>
        `).join('')}
      </div>

      <div class="sales-summary">
        <div class="sales-summary-top">
          <span style="font-size:14px;font-weight:500">${currentLabel}</span>
          <span style="font-size:12px;color:var(--grey-text)">${current.orderCount} pedido${current.orderCount !== 1 ? 's' : ''}</span>
        </div>
        <p class="sales-summary-total">${money(current.revenue)}</p>
      </div>

      <h3 class="top-dishes-title">${ic('list', 16)} Platillos más vendidos</h3>
      ${current.topDishes.length === 0 ? '<p class="empty-note" style="margin-top:0">Todavía no hay ventas registradas en este periodo.</p>' : `
        <div class="top-dishes-list">
          ${current.topDishes.map(([name, qty], i) => `
            <div class="top-dish-row"><span>${i + 1}. ${name}</span><span style="font-weight:600;color:var(--red)">${qty} vendidos</span></div>
          `).join('')}
        </div>
      `}

      <h3 class="top-dishes-title" style="margin-top:24px">${ic('receipt', 16)} Detalle de cuentas — ${currentLabel}</h3>
      ${current.bills.length === 0 ? '<p class="empty-note" style="margin-top:0">Todavía no hay cuentas en este periodo.</p>' : `
        <div class="bills-detail-list">
          ${current.bills.map((o) => `
            <div class="bill-order-block bill-detail-card">
              <p class="bill-order-meta">
                Mesa ${o.table} · ${new Date(o.createdAt).toLocaleString('es-MX', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                · ${PAYMENT_LABEL[o.payment] || o.payment}
                ${o.waiterId ? ` · Atendió: ${waiterLabel(o.waiterId)}` : ''}
              </p>
              ${o.items.map((it) => `
                <div class="bill-order-line">
                  <span>${it.qty}× ${it.name}</span>
                  <span>${money(it.price)} c/u — ${money(it.price * it.qty)}</span>
                </div>
              `).join('')}
              <div class="bill-total-row" style="font-size:14px;padding-top:6px;margin-top:6px">
                <span>Total de la cuenta</span>
                <span>${money(orderTotal(o))}</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>`;
}

/* ==================================================================
   RENDER PRINCIPAL — decide qué pantalla dibujar
   ================================================================== */
function render() {
  const app = document.getElementById('app');
  if (state.view === 'home') app.innerHTML = renderHome();
  else if (state.view === 'tablePicker') app.innerHTML = renderTablePicker();
  else if (state.view === 'customer') app.innerHTML = renderCustomer();
  else if (state.view === 'kitchen') app.innerHTML = renderKitchen();
  else if (state.view === 'waiter') app.innerHTML = renderWaiter();
  else if (state.view === 'admin') app.innerHTML = renderAdmin();
}

/* ==================================================================
   MANEJO DE CLICS (un solo listener para todo el sitio)
   Cada elemento clickeable tiene un atributo data-action que dice
   qué hacer; aquí se revisa cuál fue y se ejecuta.
   ================================================================== */
document.addEventListener('click', function (e) {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case 'modal-noop':
      break;
    case 'go-home':
      setState({ view: 'home', table: null, cart: [] });
      break;
    case 'go-customer':
      setState({ view: 'tablePicker' });
      break;
    case 'go-kitchen':
      setState({ view: 'kitchen' });
      break;
    case 'go-waiter':
      setState({ view: 'waiter' });
      break;
    case 'go-admin':
      setState({ view: 'admin' });
      break;
    case 'pick-table':
      setState({ table: Number(target.dataset.table), view: 'customer' });
      break;
    case 'pick-waiter': {
      const id = target.dataset.id;
      currentWaiterId = id;
      localStorage.setItem('tasquita_waiter_id', id);
      render();
      break;
    }
    case 'change-waiter-id': {
      currentWaiterId = null;
      localStorage.removeItem('tasquita_waiter_id');
      render();
      break;
    }
    case 'waiter-clear-table': {
      const t = Number(target.dataset.table);
      const seguro = window.confirm(`¿Marcar la mesa ${t} como cobrada? Esto la quita de esta lista, pero se conserva en el reporte de ventas.`);
      if (!seguro) break;
      ordersCache.forEach((o) => { if (o.table === t) { o.paid = true; o.waiterId = currentWaiterId; } });
      render();
      markTablePaidDB(t, currentWaiterId);
      break;
    }

    /* ---------- Cliente ---------- */
    case 'set-category':
      setState({ activeCategory: target.dataset.cat });
      break;
    case 'open-item-modal':
      setState({ modalItemId: target.dataset.id });
      break;
    case 'close-item-modal':
    case 'overlay-close-item':
      setState({ modalItemId: null });
      break;
    case 'modal-qty-inc': {
      const el = document.getElementById('modalQty');
      el.textContent = String(Number(el.textContent) + 1);
      break;
    }
    case 'modal-qty-dec': {
      const el = document.getElementById('modalQty');
      el.textContent = String(Math.max(1, Number(el.textContent) - 1));
      break;
    }
    case 'add-to-cart': {
      const item = state.menu.find((m) => m.id === target.dataset.id);
      const qty = Number(document.getElementById('modalQty').textContent);
      const notes = document.getElementById('modalNotes').value.trim();
      state.cart.push({ itemId: item.id, name: item.name, price: item.price, qty, notes });
      setState({ modalItemId: null });
      break;
    }
    case 'open-cart':
      selectedPayment = 'efectivo';
      setState({ cartOpen: true });
      break;
    case 'close-cart':
    case 'overlay-close-cart':
      setState({ cartOpen: false });
      break;
    case 'remove-cart-item':
      state.cart.splice(Number(target.dataset.idx), 1);
      setState({});
      break;
    case 'select-payment':
      selectedPayment = target.dataset.method;
      document.querySelectorAll('.payment-btn').forEach((b) => b.classList.remove('selected'));
      target.classList.add('selected');
      break;
    case 'submit-order': {
      if (state.submitting) break;
      const order = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        table: state.table,
        items: state.cart,
        payment: selectedPayment,
        status: 'pending',
        createdAt: Date.now(),
      };
      setState({ submitting: true });
      ordersCache.push(order);
      insertOrderDB(order).finally(() => {
        setState({ cartOpen: false, cart: [], confirmedOrder: order, submitting: false });
      });
      break;
    }
    case 'close-confirm':
      setState({ confirmedOrder: null });
      break;
    case 'open-bill':
      setState({ billOpen: true });
      break;
    case 'close-bill':
    case 'overlay-close-bill':
      setState({ billOpen: false });
      break;

    /* ---------- Cocina ---------- */
    case 'kitchen-advance': {
      const id = target.dataset.id;
      const next = target.dataset.next;
      const o = ordersCache.find((x) => x.id === id);
      if (o) o.status = next;
      render();
      updateOrderStatusDB(id, next);
      break;
    }

    /* ---------- Administración ---------- */
    case 'admin-section':
      setState({ adminSection: target.dataset.section });
      break;
    case 'admin-edit-start':
      setState({ editingId: target.dataset.id });
      break;
    case 'admin-edit-cancel':
      setState({ editingId: null });
      break;
    case 'admin-edit-save': {
      const id = target.dataset.id;
      const name = document.getElementById('editName').value.trim();
      const price = Number(document.getElementById('editPrice').value);
      const description = document.getElementById('editDesc').value.trim();
      const fileInput = document.getElementById('editImage');
      const file = fileInput && fileInput.files && fileInput.files[0];
      const finishEdit = (imageValue) => {
        const fields = { name, price, description };
        if (imageValue !== undefined) fields.image = imageValue;
        state.menu = state.menu.map((m) => (m.id === id ? { ...m, ...fields } : m));
        setState({ editingId: null });
        updateMenuItemDB(id, fields);
      };
      if (file) {
        readAndCompressImage(file).then(finishEdit).catch(() => finishEdit(undefined));
      } else {
        finishEdit(undefined);
      }
      break;
    }
    case 'admin-remove-image': {
      const id = target.dataset.id;
      state.menu = state.menu.map((m) => (m.id === id ? { ...m, image: '' } : m));
      setState({});
      updateMenuItemDB(id, { image: '' });
      break;
    }
    case 'admin-toggle-avail': {
      const id = target.dataset.id;
      const current = state.menu.find((m) => m.id === id);
      const available = current ? !current.available : true;
      state.menu = state.menu.map((m) => (m.id === id ? { ...m, available } : m));
      setState({});
      updateMenuItemDB(id, { available });
      break;
    }
    case 'admin-delete': {
      const id = target.dataset.id;
      state.menu = state.menu.filter((m) => m.id !== id);
      setState({});
      deleteMenuItemDB(id);
      break;
    }
    case 'admin-add-start':
      setState({ addingCat: target.dataset.cat });
      break;
    case 'admin-add-cancel':
      setState({ addingCat: null });
      break;
    case 'admin-add-save': {
      const cat = target.dataset.cat;
      const name = document.getElementById('newItemName').value.trim();
      const price = Number(document.getElementById('newItemPrice').value);
      const description = document.getElementById('newItemDesc').value.trim();
      if (!name || !price) break;
      const fileInput = document.getElementById('newItemImage');
      const file = fileInput && fileInput.files && fileInput.files[0];
      const finishAdd = (imageValue) => {
        const item = { id: `m${Date.now()}`, category: cat, name, price, description, available: true, image: imageValue || '' };
        state.menu.push(item);
        setState({ addingCat: null });
        insertMenuItemDB(item);
      };
      if (file) {
        readAndCompressImage(file).then(finishAdd).catch(() => finishAdd(''));
      } else {
        finishAdd('');
      }
      break;
    }
    case 'admin-waiter-edit-start':
      setState({ editingWaiterId: target.dataset.id });
      break;
    case 'admin-waiter-edit-cancel':
      setState({ editingWaiterId: null });
      break;
    case 'admin-waiter-edit-save': {
      const id = target.dataset.id;
      const name = document.getElementById('editWaiterName').value.trim();
      if (!name) break;
      const idx = waitersCache.findIndex((w) => w.id === id);
      if (idx > -1) waitersCache[idx] = { ...waitersCache[idx], name };
      setState({ editingWaiterId: null });
      updateWaiterDB(id, { name });
      break;
    }
    case 'admin-waiter-delete': {
      const id = target.dataset.id;
      waitersCache = waitersCache.filter((w) => w.id !== id);
      setState({});
      deleteWaiterDB(id);
      break;
    }
    case 'admin-waiter-add-start':
      setState({ addingWaiter: true });
      break;
    case 'admin-waiter-add-cancel':
      setState({ addingWaiter: false });
      break;
    case 'admin-waiter-add-save': {
      const id = document.getElementById('newWaiterId').value.trim();
      const name = document.getElementById('newWaiterName').value.trim();
      if (!id || !name) break;
      if (waitersCache.some((w) => w.id === id)) {
        window.alert(`El ID "${id}" ya existe, usa otro.`);
        break;
      }
      const waiter = { id, name };
      waitersCache.push(waiter);
      setState({ addingWaiter: false });
      insertWaiterDB(waiter);
      break;
    }
    case 'sales-tab':
      setState({ salesTab: target.dataset.tab });
      break;
  }
});

/* ==================================================================
   ACTUALIZACIÓN AUTOMÁTICA
   Si otra pestaña (por ejemplo, la de cocina) cambia los pedidos o
   el menú, esta pestaña se entera y se refresca sola.
   ================================================================== */
/* ==================================================================
   TIEMPO REAL
   Cuando cualquier dispositivo (celular del cliente, tablet de
   cocina, laptop del admin) cambia un pedido o el menú en Supabase,
   todos los demás se enteran solos y se refrescan, sin recargar.
   ================================================================== */
function subscribeRealtime() {
  sb.channel('platillos-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'platillos' }, (payload) => {
      if (payload.eventType === 'DELETE') removeLocalMenuItem(payload.old.id);
      else upsertLocalMenuItem(payload.new);
      render();
    })
    .subscribe();

  sb.channel('pedidos-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pedidos' }, (payload) => {
      if (payload.eventType === 'DELETE') {
        removeLocalOrder(payload.old.id);
      } else {
        upsertLocalOrder(payload.new);
        if (payload.eventType === 'INSERT' && state.view === 'waiter') {
          playNotificationSound();
          flashTable(payload.new.table_number);
        }
      }
      render();
    })
    .subscribe();

  sb.channel('meseros-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'meseros' }, (payload) => {
      if (payload.eventType === 'DELETE') removeLocalWaiter(payload.old.id);
      else upsertLocalWaiter(payload.new);
      render();
    })
    .subscribe();
}

/* Respaldo: en la pantalla de cocina, los "hace X min" deben
   avanzar aunque no llegue ningún cambio nuevo de Supabase. */
setInterval(function () {
  if (state.view === 'kitchen') render();
}, 15000);

/* ==================================================================
   ARRANQUE DE LA APLICACIÓN
   Carga el menú y los pedidos reales desde Supabase. Si la tabla
   "platillos" está vacía (proyecto recién creado), siembra el menú
   inicial de 60 platillos una sola vez.
   ================================================================== */
(async function init() {
  /* ---------- Entrada directa desde un código QR ----------
     Cada QR apunta a una URL distinta de esta misma página:
       index.html?mesa=3        → abre directo la mesa 3 para ordenar
       index.html?vista=cocina  → abre directo la pantalla de cocina
       index.html?vista=mesero  → abre directo las cuentas por mesa
       index.html?vista=admin   → abre directo el panel de administración
     Si no hay ningún parámetro, se muestra la pantalla de inicio normal. */
  const params = new URLSearchParams(window.location.search);
  const mesaParam = params.get('mesa');
  const vistaParam = params.get('vista');
  if (mesaParam && !Number.isNaN(Number(mesaParam))) {
    state.view = 'customer';
    state.table = Number(mesaParam);
  } else if (vistaParam === 'cocina') {
    state.view = 'kitchen';
  } else if (vistaParam === 'mesero') {
    state.view = 'waiter';
  } else if (vistaParam === 'admin') {
    state.view = 'admin';
  }

  const app = document.getElementById('app');
  app.innerHTML = '<div class="loading-screen">Cargando menú...</div>';

  const { data: menuRows, error: menuErr } = await sb.from('platillos').select('*');
  if (menuErr) {
    console.error('Error al leer el menú de Supabase:', menuErr);
    app.innerHTML = '<div class="loading-screen">No se pudo conectar con la base de datos. Revisa SUPABASE_URL y SUPABASE_ANON_KEY en script.js.</div>';
    return;
  }

  if (!menuRows || menuRows.length === 0) {
    const { error: seedErr } = await sb.from('platillos').insert(SEED_ITEMS);
    if (seedErr) console.error('Error al sembrar el menú inicial:', seedErr);
    state.menu = SEED_ITEMS;
  } else {
    state.menu = menuRows.map(rowToMenuItem);
  }

  const { data: orderRows, error: orderErr } = await sb.from('pedidos').select('*');
  if (orderErr) console.error('Error al leer los pedidos de Supabase:', orderErr);
  ordersCache = (orderRows || []).map(rowToOrder).sort((a, b) => a.createdAt - b.createdAt);

  const { data: waiterRows, error: waiterErr } = await sb.from('meseros').select('*');
  if (waiterErr) console.error('Error al leer los meseros de Supabase:', waiterErr);
  waitersCache = (waiterRows || []).map(rowToWaiter);

  subscribeRealtime();
  render();
})();