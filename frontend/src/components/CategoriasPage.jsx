import { useState, useEffect, useCallback } from 'react';
import { getCategorias, buscarCategorias, crearCategoria } from '../api/client';

export default function CategoriasPage({ onToast }) {
  const [nombre, setNombre] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  useEffect(() => {
    if (!query.trim()) { cargar(); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await buscarCategorias(query.trim());
        setCategorias(data);
      } catch (e) { /* silent */ }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, cargar]);

  async function handleCrear() {
    if (!nombre.trim()) { onToast('Escribe un nombre para la categoría.', 'error'); return; }
    setSaving(true);
    try {
      await crearCategoria({ nombre: nombre.trim() });
      onToast(`Categoría "${nombre.trim()}" creada.`);
      setNombre('');
      cargar();
    } catch (e) {
      onToast('Error: ' + e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Categorías</h1>
        <p>Registra y consulta las categorías de productos.</p>
      </div>

      <div className="api-note">
        <span className="api-badge">GET</span> <code>/categorias/</code>
        &nbsp;·&nbsp;
        <span className="api-badge api-badge-post">POST</span> <code>/categorias/</code>
        &nbsp;·&nbsp;
        <span className="api-badge">GET</span> <code>/categorias/buscar?nombre=…</code>
      </div>

      <div className="panel">
        <div className="panel-title">Nueva categoría</div>
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label htmlFor="cat-nombre">Nombre</label>
          <input
            id="cat-nombre"
            type="text"
            placeholder="Ej: Electrónica, Ropa, Alimentos…"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCrear()}
            style={{ maxWidth: 400 }}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCrear} disabled={saving}>
          {saving ? 'Guardando…' : '✓ Guardar categoría'}
        </button>
      </div>

      <div className="panel">
        <div className="panel-title">Categorías registradas</div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar categoría…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 300 }}
          />
          <button className="btn" onClick={cargar}>↺</button>
        </div>

        {error && <div className="empty-state error">⚠ {error}<br /><small>¿Está el backend corriendo?</small></div>}
        {loading && <div className="empty-state">Cargando…</div>}

        {!loading && !error && categorias.length === 0 && (
          <div className="empty-state">No hay categorías aún. Crea la primera arriba.</div>
        )}

        {!loading && !error && categorias.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 80 }}>ID</th>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((c) => (
                  <tr key={c.id}>
                    <td className="mono muted">{c.id}</td>
                    <td>{c.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
