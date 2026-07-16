'use client';

import AdminPanel from '@/components/admin/AdminCotizador';
import AdminGate from '@/components/admin/AdminGate';

export default function AdminCotizadorPage() {
  return (
    <AdminGate title="Admin Cotizador">
      <main className="flex-1 bg-gray-50 min-h-screen">
        <AdminPanel />
      </main>
    </AdminGate>
  );
}
