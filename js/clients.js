// Gerenciamento de clientes

const $ = window.utils?.$ || (id => document.getElementById(id));
const fmt = window.utils?.fmt || (v => Number(v).toFixed(2).replace('.', ','));
const api = window.apiModule?.api;

// Carregar e exibir clientes
async function loadClients() {
  try {
    const list = await api('/product/clients');
    return list || [];
  } catch (e) {
    console.error('Erro ao buscar clientes:', e);
    return [];
  }
}

// Renderizar lista de clientes
function renderClients(list) {
  const ul = $('clientsUl');
  if (!ul) return;
  
  ul.innerHTML = '';
  
  if (!list || list.length === 0) {
    ul.innerHTML = '<li style="color: var(--text-muted); text-align: center; padding: 20px;">Nenhum cliente encontrado</li>';
    return;
  }
  
  list.forEach(c => {
    const li = document.createElement('li');
    const login = c.login || c.nome || c.name || 'Desconhecido';
    const total = c.total || c.total_value || c.totalValue || 0;
    const qtd = c.qtd || c.qtd_itens || c.qtdItens || 0;
    
    li.innerHTML = `
      <strong>${login}</strong>
      <span>Total: R$ ${fmt(total)} | Itens: ${qtd}</span>
    `;
    ul.appendChild(li);
  });
}

// Mostrar/ocultar lista de clientes
function toggleClientsList() {
  const clientsList = $('clientsList');
  if (!clientsList) return;
  
  clientsList.classList.toggle('hidden');
  
  if (!clientsList.classList.contains('hidden')) {
    loadAndShowClients();
  }
}

// Carregar e exibir clientes
async function loadAndShowClients() {
  const list = await loadClients();
  renderClients(list);
}

// Exportar
window.clientsModule = {
  loadClients,
  renderClients,
  toggleClientsList,
  loadAndShowClients
};

