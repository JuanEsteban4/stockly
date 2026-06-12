import { useState, useEffect, useCallback } from 'react';
import { getProductos, buscarProductos, crearProducto, getCategorias, } from '../api/client';
import { fmtPrice, calcMargen } from '../utils';
import StockBadge from './StockBadge';

const EMPTY_FORM = {
  nombre: '',
  sku: '',
  descripcion: '',
  precio_costo: '',
  precio_venta: '',
  stock_actual: 0,
  stock_minimo: 5,
  categoria_id: '',
};

export default function ProductosPage({ onToast }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const cargarProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [prods, cats] = await Promise.all([getProductos(), getCategorias()]);
      setProductos(prods);
      setCategorias(cats);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargarProductos(); }, [cargarProductos]);

  useEffect(() => {
    if (!query.trim()) { cargarProductos(); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await buscarProductos(query.trim());
        setProductos(data);
      } catch (e) { /* silent */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, cargarProductos]);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleCrear() {
    const { nombre, sku, precio_costo, precio_venta } = form;
    if (!nombre.trim() || !sku.trim() || precio_costo === '' || precio_venta === '') {
      onToast('Completa los campos obligatorios (nombre, SKU, precios).', 'error');
      return;
    }
    const body = {
      nombre: nombre.trim(),
      sku: sku.trim(),
      descripcion: form.descripcion.trim() || null,
      precio_costo: parseFloat(precio_costo),
      precio_venta: parseFloat(precio_venta),
      stock_actual: parseInt(form.stock_actual) || 0,
      stock_minimo: parseInt(form.stock_minimo) || 5,
    };
    if (form.categoria_id) body.categoria_id = parseInt(form.categoria_id);

    setSaving(true);
    try {
      await crearProducto(body);
      onToast(`Producto "${nombre.trim()}" creado.`);
      setForm(EMPTY_FORM);
      cargarProductos();
    } catch (e) {
      onToast('Error: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  const total = productos.length;
  const stockBajo = productos.filter((p) => p.stock_actual > 0 && p.stock_actual <= p.stock_minimo).length;
  const sinStock = productos.filter((p) => p.stock_actual === 0).length;
  const margenPreview = calcMargen(parseFloat(form.precio_costo), parseFloat(form.precio_venta));

  function catName(id) {
    const c = categorias.find((c) => c.id === id);
    return c ? c.nombre : null;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Productos</h1>
        <p>Registra nuevos productos y consulta el inventario completo.</p>
      </div>

      <div className="api-note">
        <span className="api-badge">GET</span> <code>/productos/</code>
        &nbsp;·&nbsp;
        <span className="api-badge api-badge-post">POST</span> <code>/productos/</code>
        &nbsp;·&nbsp;
        <span className="api-badge">GET</span> <code>/categorias/</code>
      </div>

      <div className="stats-row">
        <div className="metric-card">
          <div className="metric-label">Total productos</div>
          <div className="metric-value">{total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Stock bajo</div>
          <div className="metric-value" style={{ color: stockBajo > 0 ? '#854F0B' : undefined }}>{stockBajo}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Sin stock</div>
          <div className="metric-value" style={{ color: sinStock > 0 ? '#A32D2D' : undefined }}>{sinStock}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Categorías</div>
          <div className="metric-value">{categorias.length}</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Nuevo producto</div>

        <div className="form-row">
          <div className="form-group">
            <label>Nombre *</label>
            <input type="text" placeholder="Nombre del producto" value={form.nombre} onChange={set('nombre')} />
          </div>
          <div className="form-group">
            <label>SKU *</label>
            <input type="text" placeholder="Ej: ELEC-001" value={form.sku} onChange={set('sku')} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label>Descripción (opcional)</label>
          <textarea
            placeholder="Descripción breve…"
            value={form.descripcion}
            onChange={set('descripcion')}
            rows={2}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Precio costo ($) *</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.precio_costo}
              onChange={set('precio_costo')}
            />
          </div>
          <div className="form-group">
            <label>Precio venta ($) *</label>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="0.01"
              value={form.precio_venta}
              onChange={set('precio_venta')}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Stock actual</label>
            <input type="number" min="0" value={form.stock_actual} onChange={set('stock_actual')} />
          </div>
          <div className="form-group">
            <label>Stock mínimo</label>
            <input type="number" min="0" value={form.stock_minimo} onChange={set('stock_minimo')} />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Categoría</label>
          <select value={form.categoria_id} onChange={set('categoria_id')} style={{ maxWidth: 300 }}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-primary" onClick={handleCrear} disabled={saving}>
            {saving ? 'Guardando…' : '✓ Guardar producto'}
          </button>
          {margenPreview !== null && (
            <span style={{
              fontSize: 13,
              color: parseFloat(margenPreview) >= 0 ? '#3B6D11' : '#A32D2D',
            }}>
              Margen: {margenPreview}%
            </span>
          )}
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">Inventario</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar producto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <button className="btn" onClick={cargarProductos}>↺</button>
        </div>

        {error && <div className="empty-state error">⚠ {error}<br /><small>¿Está corriendo el backend?</small></div>}
        {loading && <div className="empty-state">Cargando…</div>}

        {!loading && !error && productos.length === 0 && (
          <div className="empty-state">Sin productos aún. Crea el primero arriba.</div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>SKU</th>
                  <th>Categoría</th>
                  <th>Costo</th>
                  <th>Venta</th>
                  <th>Margen</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const m = calcMargen(p.precio_costo, p.precio_venta);
                  const cat = catName(p.categoria_id);
                  return (
                    <tr key={p.id}>
                      <td><strong>{p.nombre}</strong></td>
                      <td className="mono muted">{p.sku}</td>
                      <td>
                        {cat
                          ? <span className="cat-badge">{cat}</span>
                          : <span className="muted">—</span>
                        }
                      </td>
                      <td className="price">{fmtPrice(p.precio_costo)}</td>
                      <td className="price bold">{fmtPrice(p.precio_venta)}</td>
                      <td className={m !== null ? (parseFloat(m) >= 0 ? 'pos' : 'neg') : ''}>
                        {m !== null ? `${m}%` : '—'}
                      </td>
                      <td>
                        <StockBadge actual={p.stock_actual} minimo={p.stock_minimo} />
                        <span className="muted-sm" style={{ marginLeft: 6 }}>{p.stock_actual}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
