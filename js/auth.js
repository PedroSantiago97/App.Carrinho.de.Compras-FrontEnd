// Autenticação JWT

const $ = window.utils?.$ || (id => document.getElementById(id));
const api = window.apiModule?.api;

// Verificar se usuário está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decodificar JWT (parte do payload)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Converter para milissegundos
    return Date.now() < exp;
  } catch {
    return false;
  }
}

// Obter dados do usuário do token
function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      login: payload.sub || payload.login || payload.username,
      role: payload.role || payload.authorities?.[0] || null
    };
  } catch {
    return null;
  }
}

// Fazer login
async function login(login, password) {
  try {
    const API_BASE = window.utils?.API_BASE || localStorage.getItem('API_BASE') || 'http://localhost:8080';
    const response = await fetch(API_BASE + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login, password })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Credenciais inválidas');
    }
    
    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('userLogin', login);
      return { success: true, user: getUserFromToken() };
    }
    
    throw new Error('Token não recebido');
  } catch (e) {
    console.error('Erro no login:', e);
    return { success: false, error: e.message || 'Erro ao fazer login' };
  }
}

// Fazer logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userLogin');
  window.location.href = 'login.html';
}

// Verificar se é admin
function isAdmin() {
  const user = getUserFromToken();
  return user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN');
}

// Proteger rota (redirecionar se não autenticado)
function requireAuth() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// Proteger rota admin (redirecionar se não for admin)
function requireAdmin() {
  if (!requireAuth()) {
    return false;
  }
  
  if (!isAdmin()) {
    alert('Acesso negado. Apenas administradores podem acessar esta página.');
    window.location.href = 'index.html';
    return false;
  }
  
  return true;
}

// Atualizar UI de autenticação
function updateAuthUI() {
  const user = getUserFromToken();
  const loggedAs = $('loggedAs');
  const btnLogout = $('btnLogout');
  const btnLogin = $('btnLogin');
  
  if (loggedAs) {
    if (user) {
      loggedAs.textContent = `Olá, ${user.login}!`;
      loggedAs.classList.remove('hidden');
    } else {
      loggedAs.classList.add('hidden');
    }
  }
  
  if (btnLogout) {
    if (user) {
      btnLogout.classList.remove('hidden');
      btnLogout.onclick = logout;
    } else {
      btnLogout.classList.add('hidden');
    }
  }
  
  if (btnLogin) {
    if (!user) {
      btnLogin.classList.remove('hidden');
    } else {
      btnLogin.classList.add('hidden');
    }
  }
}

// Exportar
window.authModule = {
  isAuthenticated,
  getUserFromToken,
  login,
  logout,
  isAdmin,
  requireAuth,
  requireAdmin,
  updateAuthUI
};

