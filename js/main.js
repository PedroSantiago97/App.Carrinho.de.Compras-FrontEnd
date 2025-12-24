// Script principal da página da loja

const $ = window.utils?.$ || (id => document.getElementById(id));
const { updateAuthUI, isAuthenticated, isAdmin, logout } = window.authModule || {};
const { loadProducts, filterProducts } = window.productsModule || {};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Atualizar UI de autenticação
  if (updateAuthUI) {
    updateAuthUI();
    
    const authenticated = isAuthenticated && isAuthenticated();
    
    // Botão Login
    const btnLogin = $('btnLogin');
    if (btnLogin) {
      if (authenticated) {
        btnLogin.classList.add('hidden');
      } else {
        btnLogin.classList.remove('hidden');
        btnLogin.onclick = () => {
          window.location.href = 'login.html';
        };
      }
    }
    
    // Botão Cadastrar
    const btnRegister = $('btnRegister');
    if (btnRegister) {
      if (authenticated) {
        btnRegister.classList.add('hidden');
      } else {
        btnRegister.classList.remove('hidden');
        btnRegister.onclick = () => {
          window.location.href = 'register.html';
        };
      }
    }
    
    // Botão Admin
    const btnAdmin = $('btnAdmin');
    if (btnAdmin) {
      if (authenticated && isAdmin && isAdmin()) {
        btnAdmin.classList.remove('hidden');
        btnAdmin.onclick = () => {
          window.location.href = 'admin.html';
        };
      } else {
        btnAdmin.classList.add('hidden');
      }
    }
    
    // Botão Logout
    const btnLogout = $('btnLogout');
    if (btnLogout) {
      if (authenticated) {
        btnLogout.classList.remove('hidden');
        btnLogout.onclick = () => {
          if (logout) logout();
        };
      } else {
        btnLogout.classList.add('hidden');
      }
    }
  }
  
  // Botão Atualizar
  const btnRefresh = $('btnRefresh');
  if (btnRefresh && loadProducts) {
    btnRefresh.onclick = loadProducts;
  }
  
  // Busca de produtos
  const search = $('search');
  if (search && filterProducts) {
    search.addEventListener('input', (e) => {
      filterProducts(e.target.value);
    });
  }
  
  // Carregar produtos iniciais
  if (loadProducts) loadProducts();
});

