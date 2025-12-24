// Script da página de login

const $ = window.utils?.$ || (id => document.getElementById(id));

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Verificar se já está logado e redirecionar
  const { requireAuth, isAdmin } = window.authModule || {};
  if (requireAuth && requireAuth()) {
    if (isAdmin && isAdmin()) {
      window.location.href = 'admin.html';
      return;
    } else {
      window.location.href = 'index.html';
      return;
    }
  }
  
  const { login } = window.authModule || {};
  const loginForm = $('loginForm');
  const errorMessage = $('errorMessage');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const loginInput = $('login');
      const passwordInput = $('password');
      
      if (!loginInput || !passwordInput) return;
      
      const loginValue = loginInput.value.trim();
      const passwordValue = passwordInput.value;
      
      if (!loginValue || !passwordValue) {
        showError('Por favor, preencha todos os campos.');
        return;
      }
      
      if (!login) {
        showError('Erro: módulo de autenticação não carregado.');
        return;
      }
      
      // Mostrar loading
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Entrando...';
      hideError();
      
      const result = await login(loginValue, passwordValue);
      
      if (result.success) {
        // Redirecionar baseado no role
        const { isAdmin } = window.authModule || {};
        if (isAdmin && isAdmin()) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'index.html';
        }
      } else {
        showError(result.error || 'Erro ao fazer login. Verifique suas credenciais.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
    }
  }
  
  function hideError() {
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
  }
});

