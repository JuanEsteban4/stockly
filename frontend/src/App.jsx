import { useState } from 'react';
import PreciosPage from './components/PreciosPage';
import CategoriasPage from './components/CategoriasPage';
import ProductosPage from './components/ProductosPage';
import { useToast } from './hooks/useToast';
import './App.css';

const PAGES = [
  { id: 'precios',    label: 'Precios',    icon: '💲' },
  { id: 'categorias', label: 'Categorías', icon: '🏷' },
  { id: 'productos',  label: 'Productos',  icon: '📦' },
];

export default function App() {
  const [page, setPage] = useState('precios');
  const { toast, show: showToast } = useToast();

  return (
    <div className="app">
      <nav className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-text">Stockly</span>
          <small>Gestión de inventario</small>
        </div>
        {PAGES.map((p) => (
          <button
            key={p.id}
            className={`nav-item${page === p.id ? ' active' : ''}`}
            onClick={() => setPage(p.id)}
          >
            <span className="nav-icon">{p.icon}</span>
            {p.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {page === 'precios'    && <PreciosPage />}
        {page === 'categorias' && <CategoriasPage onToast={showToast} />}
        {page === 'productos'  && <ProductosPage  onToast={showToast} />}
      </main>

      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
