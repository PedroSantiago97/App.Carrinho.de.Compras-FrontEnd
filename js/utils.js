// Funções auxiliares
const $ = id => document.getElementById(id);
const fmt = v => Number(v).toFixed(2).replace('.', ',');

// Configuração
const API_BASE = localStorage.getItem('API_BASE') || 'http://localhost:8080';

// Exportar para uso global
window.utils = { $, fmt, API_BASE };

