import { Outlet } from 'react-router-dom';
import PainelLateral from '@/layout/PainelLateral';

export default function LayoutApp() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <PainelLateral />
      <main className="flex-1 px-4 py-10 md:px-10">
        <Outlet />
      </main>
    </div>
  );
}
