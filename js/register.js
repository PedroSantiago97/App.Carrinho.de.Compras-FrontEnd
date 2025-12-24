// Script da página de cadastro

const $ = window.utils?.$ || (id => document.getElementById(id));

// Função para fazer cadastro
async function register(login, password) {
  try {
    const API_BASE = window.utils?.API_BASE || localStorage.getItem('API_BASE') || 'http://localhost:8080';
    const response = await fetch(API_BASE + '/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        login, 
        password,
        role: 'CUSTOMER' // Por padrão, novos usuários são clientes
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Erro ao cadastrar');
    }
    
    // Se retornar algo, tentar parsear
    const text = await response.text();
    if (text) {
      try {
        return { success: true, data: JSON.parse(text) };
      } catch {
        return { success: true };
      }
    }
    
    return { success: true };
  } catch (e) {
    console.error('Erro no cadastro:', e);
    return { success: false, error: e.message || 'Erro ao fazer cadastro' };
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = $('registerForm');
  const errorMessage = $('errorMessage');
  const successMessage = $('successMessage');
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const loginInput = $('login');
      const passwordInput = $('password');
      const confirmPasswordInput = $('confirmPassword');
      
      if (!loginInput || !passwordInput || !confirmPasswordInput) return;
      
      const loginValue = loginInput.value.trim();
      const passwordValue = passwordInput.value;
      const confirmPasswordValue = confirmPasswordInput.value;
      
      // Validações
      if (!loginValue || !passwordValue || !confirmPasswordValue) {
        showError('Por favor, preencha todos os campos.');
        return;
      }
      
      if (passwordValue.length < 6) {
        showError('A senha deve ter no mínimo 6 caracteres.');
        return;
      }
      
      if (passwordValue !== confirmPasswordValue) {
        showError('As senhas não coincidem.');
        return;
      }
      
      // Mostrar loading
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Cadastrando...';
      hideError();
      hideSuccess();
      
      const result = await register(loginValue, passwordValue);
      
      if (result.success) {
        showSuccess('Cadastro realizado com sucesso! Redirecionando para login...');
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      } else {
        showError(result.error || 'Erro ao fazer cadastro. Tente novamente.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
  
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      if (successMessage) {
        successMessage.classList.add('hidden');
      }
    }
  }
  
  function hideError() {
    if (errorMessage) {
      errorMessage.classList.add('hidden');
    }
  }
  
  function showSuccess(message) {
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.classList.remove('hidden');
      if (errorMessage) {
        errorMessage.classList.add('hidden');
      }
    }
  }
  
  function hideSuccess() {
    if (successMessage) {
      successMessage.classList.add('hidden');
    }
  }
});

