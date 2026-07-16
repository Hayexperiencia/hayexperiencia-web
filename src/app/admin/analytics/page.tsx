'use client';

import AnalyticsPanel from '@/components/admin/analytics/AnalyticsPanel';
import AdminGate from '@/components/admin/AdminGate';

export default function AdminAnalyticsPage() {
  return (
    <AdminGate title="Admin Analytics">
      <main className="flex-1 bg-gray-50 min-h-screen">
        <AnalyticsPanel />
      </main>
    </AdminGate>
  );
}
