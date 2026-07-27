import axios from 'axios';

export const CHAVE_TOKEN = 'domus.token';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(CHAVE_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RNF12: sessão expirada ou token inválido derruba a sessão em qualquer tela,
// sem que cada uma precise tratar 401. O desvio para /login é ignorado quando
// já se está nele, para não interferir na mensagem de credencial inválida.
apiClient.interceptors.response.use(
  (resposta) => resposta,
  (erro) => {
    if (erro.response?.status === 401) {
      localStorage.removeItem(CHAVE_TOKEN);

      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }

    return Promise.reject(erro);
  },
);

export default apiClient;
