// Funções genéricas para chamadas à API
const API_BASE = window.utils?.API_BASE || localStorage.getItem('API_BASE') || 'http://localhost:8080';

// Obter token do localStorage
function getToken() {
  return localStorage.getItem('token') || null;
}

// Função genérica para chamadas à API
async function api(path, opts = {}) {
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(API_BASE + path, { ...opts, headers });
  
  if (res.status === 204 || res.status === 200) {
    const text = await res.text();
    if (!text) return null;
    
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  
  // Se não for sucesso, tratar como erro
  const text = await res.text();
  let errorMessage = `Erro ${res.status}`;
  
  try {
    const errorData = JSON.parse(text);
    errorMessage = errorData.message || errorData.error || text || errorMessage;
  } catch {
    errorMessage = text || errorMessage;
  }
  
  throw new Error(errorMessage);
}

// Verificar se resposta é de sucesso
function isOk(res) {
  return res && res.status >= 200 && res.status < 300;
}

// Exportar
window.apiModule = { api, getToken };

