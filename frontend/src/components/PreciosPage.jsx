import { useState, useEffect } from 'react';
import { getProductos, buscarProductos,buscarProductosPorSku } from '../api/client';
import { fmtPrice, calcMargen } from '../utils';
import StockBadge from './StockBadge';

export default function PreciosPage() {
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  async function cargarTodos() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductos();
      setProductos(data);
      setLoaded(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!query.trim()) {
      if (loaded) return;
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        let data = await buscarProductos(query.trim());
        
      if (data.length === 0) {
        const result = await buscarProductosPorSku(query.trim());
      data = result ? [result] : [];
      }
        setProductos(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <div className="page-header">
        <h1>Consulta de precios</h1>
        <p>Busca un producto por nombre para ver su precio de costo, venta y margen.</p>
      </div>

      <div className="api-note">
        <span className="api-badge">GET</span>
        <code>/productos/buscar?nombre=…</code> · <code>/productos/</code>
      </div>

      <div className="panel">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Nombre del producto…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn" onClick={cargarTodos} disabled={loading}>
            {loading ? '…' : '↺ Todos'}
          </button>
        </div>

        {error && (
          <div className="empty-state error">
            <span>⚠ {error}</span>
          </div>
        )}

        {!error && !loaded && !loading && (
          <div className="empty-state">
            Escribe un nombre o presiona "Todos" para ver los productos.
          </div>
        )}

        {loading && <div className="empty-state">Cargando…</div>}

        {!loading && !error && loaded && productos.length === 0 && (
          <div className="empty-state">Sin resultados.</div>
        )}

        {!loading && !error && productos.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>SKU</th>
                  <th>Costo</th>
                  <th>Venta</th>
                  <th>Margen</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => {
                  const m = calcMargen(p.precio_costo, p.precio_venta);
                  return (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.nombre}</strong>
                        {p.descripcion && (
                          <div className="muted-sm">{p.descripcion}</div>
                        )}
                      </td>
                      <td className="mono muted">{p.sku}</td>
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
