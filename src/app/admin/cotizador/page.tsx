import type { Metadata } from 'next';
import AdminPanel from '@/components/admin/AdminCotizador';

export const metadata: Metadata = {
  title: 'Admin Cotizador | Hay Experiencia',
  robots: 'noindex, nofollow',
};

export default function AdminCotizadorPage() {
  return (
    <main className="flex-1 bg-gray-50 min-h-screen">
      <AdminPanel />
    </main>
  );
}
