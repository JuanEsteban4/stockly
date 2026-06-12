export function fmtPrice(n) {
  return '$' + Number(n).toLocaleString('es-CO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function calcMargen(costo, venta) {
  if (!costo || costo === 0) return null;
  return ((venta - costo) / costo * 100).toFixed(1);
}

export function stockStatus(actual, minimo) {
  if (actual === 0) return 'empty';
  if (actual <= minimo) return 'low';
  return 'ok';
}
