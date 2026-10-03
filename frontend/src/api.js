const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
let accessToken = localStorage.getItem('accessToken') || '';

export function setAccessToken(token) {
  accessToken = token || '';
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  else localStorage.removeItem('accessToken');
}

async function request(path, options = {}, retry = true) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  let response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  if (response.status === 401 && retry && !path.includes('/auth/login') && !path.includes('/auth/refresh-token')) {
    const refresh = await fetch(`${API_URL}/auth/refresh-token`, { method: 'POST', credentials: 'include' });
    if (refresh.ok) {
      const data = await refresh.json();
      setAccessToken(data.accessToken);
      return request(path, options, false);
    }
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.errors?.map(e => e.message).join(', ') || data.message || 'Request failed');
  return data;
}

export const api = {
  register: body => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: async body => { const data = await request('/auth/login', { method: 'POST', body: JSON.stringify(body) }); setAccessToken(data.accessToken); return data; },
  me: () => request('/auth/me'),
  logout: async () => { const data = await request('/auth/logout', { method: 'POST' }); setAccessToken(''); return data; },
  products: () => request('/products'),
  createProduct: body => request('/products', { method: 'POST', body: JSON.stringify(body) }),
  updateProduct: (id, body) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProduct: id => request(`/products/${id}`, { method: 'DELETE' })
};
