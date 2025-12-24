// Script da página de admin

const $ = window.utils?.$ || (id => document.getElementById(id));
const { requireAdmin, updateAuthUI, logout } = window.authModule || {};
const { addProduct } = window.productsModule || {};
const { loadAndShowClients, renderClients } = window.clientsModule || {};

// Proteger página (requer admin)
if (requireAdmin && !requireAdmin()) {
  // Redirecionamento será feito pela função requireAdmin
  // Não continuar execução
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Atualizar UI de autenticação
  if (updateAuthUI) {
    updateAuthUI();
  }
  
  // Botão logout
  const btnLogout = $('btnLogout');
  if (btnLogout && logout) {
    btnLogout.onclick = logout;
  }
  
  // Botão ir para loja
  const btnStore = $('btnStore');
  if (btnStore) {
    btnStore.onclick = () => {
      window.location.href = 'index.html';
    };
  }
  
  // Formulário de adicionar produto
  const addProductForm = $('addProductForm');
  const errorMessage = $('productErrorMessage');
  const successMessage = $('productSuccessMessage');
  
  if (addProductForm && addProduct) {
    addProductForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const pName = $('pName');
      const pImage = $('pImage');
      const pPrice = $('pPrice');
      
      if (!pName || !pImage || !pPrice) return;
      
      const name = pName.value.trim();
      const image_url = pImage.value.trim();
      const price = pPrice.value;
      
      // Validações
      if (!name) {
        showError('Por favor, informe o nome do produto.');
        pName.focus();
        return;
      }
      
      if (!image_url) {
        showError('Por favor, informe a URL da imagem.');
        pImage.focus();
        return;
      }
      
      if (!price || isNaN(price) || parseFloat(price) <= 0) {
        showError('Por favor, informe um preço válido.');
        pPrice.focus();
        return;
      }
      
      // Mostrar loading
      const submitBtn = addProductForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adicionando...';
      hideError();
      hideSuccess();
      
      const result = await addProduct(name, image_url, price);
      
      if (result.success) {
        showSuccess('Produto adicionado com sucesso!');
        pName.value = '';
        pImage.value = '';
        pPrice.value = '';
      } else {
        showError(result.error || 'Erro ao adicionar produto.');
      }
      
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    });
  }
  
  // Botão carregar clientes
  const btnLoadClients = $('btnLoadClients');
  const clientsList = $('clientsList');
  
  if (btnLoadClients && loadAndShowClients) {
    btnLoadClients.onclick = async () => {
      btnLoadClients.disabled = true;
      btnLoadClients.textContent = 'Carregando...';
      
      await loadAndShowClients();
      
      if (clientsList) {
        clientsList.classList.remove('hidden');
      }
      
      btnLoadClients.disabled = false;
      btnLoadClients.textContent = 'Carregar Clientes';
    };
  }
  
  function showError(message) {
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.classList.remove('hidden');
      setTimeout(hideError, 5000);
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
      setTimeout(hideSuccess, 5000);
    }
  }
  
  function hideSuccess() {
    if (successMessage) {
      successMessage.classList.add('hidden');
    }
  }
});

