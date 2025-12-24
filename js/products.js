// Gerenciamento de produtos

const $ = window.utils?.$ || (id => document.getElementById(id));
const fmt = window.utils?.fmt || (v => Number(v).toFixed(2).replace('.', ','));
const api = window.apiModule?.api;

let products = [];

// Carregar produtos
async function loadProducts() {
  try {
    const data = await api('/product');
    products = Array.isArray(data) ? data : [];
    renderProducts(products);
    return products;
  } catch (e) {
    console.error('Erro ao carregar produtos:', e);
    const productsDiv = $('products');
    if (productsDiv) {
      productsDiv.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <h3>Erro ao carregar produtos</h3>
          <p>Verifique se o backend está rodando.</p>
        </div>
      `;
    }
    return [];
  }
}

// Renderizar produtos
function renderProducts(list) {
  const out = $('products');
  if (!out) return;
  
  out.innerHTML = '';
  
  if (list.length === 0) {
    out.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <h3>Nenhum produto encontrado</h3>
        <p>Adicione produtos usando a página de administração</p>
      </div>
    `;
    return;
  }
  
  list.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card';
    
    const img = document.createElement('img');
    img.src = p.image_url || 'https://via.placeholder.com/200x140?text=Sem+Imagem';
    img.alt = p.name;
    img.onerror = function() {
      this.src = 'https://via.placeholder.com/200x140?text=Erro+Imagem';
    };
    
    const h4 = document.createElement('h4');
    h4.textContent = p.name;
    
    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = `R$ ${fmt(p.price)}`;
    
    // Tornar o card clicável
    div.style.cursor = 'pointer';
    div.onclick = () => {
      window.location.href = 'login.html';
    };
    
    // Adicionar texto indicativo
    const clickHint = document.createElement('div');
    clickHint.style.cssText = 'margin-top: 8px; padding: 8px; background: var(--accent); color: #fff; border-radius: 6px; text-align: center; font-size: 13px; font-weight: 500;';
    clickHint.textContent = 'Clique para comprar';
    div.appendChild(clickHint);
    
    div.append(img, h4, price);
    out.appendChild(div);
  });
}

// Filtrar produtos
function filterProducts(searchTerm) {
  if (!searchTerm || !searchTerm.trim()) {
    renderProducts(products);
    return;
  }
  
  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );
  renderProducts(filtered);
}

// Adicionar produto (admin)
async function addProduct(name, image_url, price) {
  try {
    await api('/product/add', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        image_url: image_url.trim(),
        price: parseFloat(price)
      })
    });
    
    return { success: true };
  } catch (e) {
    console.error('Erro ao adicionar produto:', e);
    const errorMsg = e.message || e || 'Erro desconhecido';
    
    if (errorMsg.includes('CONFLICT') || errorMsg.includes('Already Exists')) {
      return { success: false, error: 'Já existe um produto com esse nome!' };
    }
    
    return { success: false, error: errorMsg };
  }
}

// Obter lista de produtos
function getProducts() {
  return products;
}

// Exportar
window.productsModule = {
  loadProducts,
  renderProducts,
  filterProducts,
  addProduct,
  getProducts
};

