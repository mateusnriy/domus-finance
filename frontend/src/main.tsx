import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import ToastProvider from '@/components/ToastProvider';
import '@/index.css';

const raiz = document.getElementById('root');

if (!raiz) {
  throw new Error('Elemento raiz não encontrado.');
}

createRoot(raiz).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
