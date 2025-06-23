// js/data/productCache.js
export let productMap = new Map();

export async function loadProducts() {
  const res = await fetch('http://localhost:3001/api/product');
  const products = await res.json();
  productMap = new Map(products.map(p => [p.id, p]));
}
