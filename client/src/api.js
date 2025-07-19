// src/api.js
const API_BASE = 'http://localhost:8080';

export async function fetchItems() {
  const res = await fetch(`${API_BASE}/items`);
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function createItem(item) {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to create item');
  return res.json();
}

// src/api.js
export async function fetchInvoices() {
  try {
    const res = await fetch('http://localhost:8080/invoices');
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data || [];  // ensure it returns an array
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return [];  // fallback to empty array on error
  }
}


export async function createInvoice(invoice) {
  const res = await fetch(`${API_BASE}/invoices`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(invoice),
  });
  if (!res.ok) throw new Error('Failed to create invoice');
  return res.json();
}

export async function fetchInvoiceDetails(id) {
  const res = await fetch(`${API_BASE}/invoices/${id}`);
  if (!res.ok) throw new Error('Failed to fetch invoice details');
  return res.json();
}
