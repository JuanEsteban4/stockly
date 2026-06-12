const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }

  return res.json();
}

// Categorías
export const getCategorias = () => request('/categorias/');
export const buscarCategorias = (nombre) =>
  request(`/categorias/buscar?nombre=${encodeURIComponent(nombre)}`);
export const crearCategoria = (data) =>
  request('/categorias/', { method: 'POST', body: JSON.stringify(data) });

// Productos
export const getProductos = () => request('/productos/');
export const buscarProductos = (nombre) =>
  request(`/productos/buscar?nombre=${encodeURIComponent(nombre)}`);
export const crearProducto = (data) =>
  request('/productos/', { method: 'POST', body: JSON.stringify(data) });
export const buscarProductosPorSku = (sku) =>
  request(`/productos/buscar_sku?sku=${encodeURIComponent(sku)}`)
