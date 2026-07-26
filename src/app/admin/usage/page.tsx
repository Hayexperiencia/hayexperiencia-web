'use client';

import UsagePanel from '@/components/admin/usage/UsagePanel';
import AdminGate from '@/components/admin/AdminGate';

export default function AdminUsagePage() {
  return (
    <AdminGate title="Consumo de IA">
      <main className="flex-1 min-h-screen">
        <UsagePanel />
      </main>
    </AdminGate>
  );
}
