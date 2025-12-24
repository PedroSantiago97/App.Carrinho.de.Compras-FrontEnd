// Gerenciamento de carrinho

const $ = window.utils?.$ || (id => document.getElementById(id));
const fmt = window.utils?.fmt || (v => Number(v).toFixed(2).replace('.', ','));
const api = window.apiModule?.api;

let cart = [];

// Adicionar produto ao carrinho
function addToCart(product) {
  const userName = localStorage.getItem('userLogin') || '';
  
  if (!userName) {
    alert('Por favor, faça login antes de adicionar produtos ao carrinho.');
    window.location.href = 'login.html';
    return;
  }
  
  const existing = cart.find(c => c.id === product.id);
  if (existing) {
    existing.qtd++;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qtd: 1
    });
  }
  renderCart();
}

// Remover item do carrinho
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
}

// Limpar carrinho
function clearCart() {
  cart = [];
  renderCart();
}

// Renderizar carrinho
function renderCart() {
  const ul = $('cartItems');
  if (!ul) return;
  
  ul.innerHTML = '';
  
  if (cart.length === 0) {
    ul.innerHTML = '<li style="color: var(--text-muted); padding: 20px; text-align: center;">Carrinho vazio</li>';
    const cartTotal = $('cartTotal');
    if (cartTotal) cartTotal.textContent = '0.00';
    const btnCheckout = $('btnCheckout');
    if (btnCheckout) btnCheckout.disabled = true;
    return;
  }
  
  let total = 0;
  cart.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span>${item.name} x${item.qtd}</span>
        <span>R$ ${fmt(item.price * item.qtd)}</span>
      </div>
    `;
    ul.appendChild(li);
    total += item.price * item.qtd;
  });
  
  const cartTotal = $('cartTotal');
  if (cartTotal) cartTotal.textContent = fmt(total);
  
  const btnCheckout = $('btnCheckout');
  if (btnCheckout) btnCheckout.disabled = false;
}

// Finalizar compra
async function checkout() {
  if (cart.length === 0) {
    alert('Carrinho vazio!');
    return;
  }
  
  const userName = localStorage.getItem('userLogin');
  if (!userName) {
    alert('Por favor, faça login antes de finalizar a compra.');
    window.location.href = 'login.html';
    return;
  }
  
  const total = cart.reduce((s, i) => s + i.price * i.qtd, 0);
  const qtd = cart.reduce((s, i) => s + i.qtd, 0);
  
  try {
    await api('/product/chart/add', {
      method: 'POST',
      body: JSON.stringify({
        nome: userName,
        total_value: total,
        qtd_itens: qtd
      })
    });
    
    alert('Compra enviada com sucesso!');
    clearCart();
  } catch (e) {
    console.error('Erro ao finalizar compra:', e);
    alert('Erro ao enviar compra: ' + (e.message || 'Erro desconhecido'));
  }
}

// Obter carrinho
function getCart() {
  return cart;
}

// Exportar
window.cartModule = {
  addToCart,
  removeFromCart,
  clearCart,
  renderCart,
  checkout,
  getCart
};

