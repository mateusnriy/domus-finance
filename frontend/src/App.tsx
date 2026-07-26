import { Navigate, Route, Routes } from 'react-router-dom';
import LayoutApp from '@/layout/LayoutApp';
import LoginPage from '@/features/auth/LoginPage';
import TotaisPage from '@/features/totais/TotaisPage';
import TransacoesPage from '@/features/transacoes/TransacoesPage';
import PessoasPage from '@/features/pessoas/PessoasPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<LayoutApp />}>
        <Route path="/totais" element={<TotaisPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/pessoas" element={<PessoasPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/totais" replace />} />
      <Route path="*" element={<Navigate to="/totais" replace />} />
    </Routes>
  );
}
