'use client';

import MercadoPanel from '@/components/admin/mercado/MercadoPanel';
import AdminGate from '@/components/admin/AdminGate';

export default function AdminMercadoPage() {
  return (
    <AdminGate title="Admin Mercado">
      <main className="flex-1 bg-gray-50 min-h-screen">
        <MercadoPanel />
      </main>
    </AdminGate>
  );
}
