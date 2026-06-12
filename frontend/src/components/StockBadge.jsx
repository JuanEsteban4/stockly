import { stockStatus } from '../utils';

const STYLES = {
  ok:    { background: '#EAF3DE', color: '#3B6D11' },
  low:   { background: '#FAEEDA', color: '#854F0B' },
  empty: { background: '#FCEBEB', color: '#A32D2D' },
};
const LABELS = { ok: 'OK', low: 'Stock bajo', empty: 'Sin stock' };

export default function StockBadge({ actual, minimo }) {
  const status = stockStatus(actual, minimo);
  return (
    <span style={{
      ...STYLES[status],
      fontSize: 11,
      fontWeight: 500,
      padding: '2px 8px',
      borderRadius: 99,
      display: 'inline-block',
    }}>
      {LABELS[status]}
    </span>
  );
}
