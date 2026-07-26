import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/useAuth';
import Carregando from '@/components/Carregando';

export default function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <Carregando rotulo="Verificando sessão" />;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
