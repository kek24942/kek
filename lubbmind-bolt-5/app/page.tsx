"use client"

import { DashboardStats } from '@/components/dashboard-stats';
import { useTranslation } from 'react-i18next';

// Mock clinic ID - in real app, this would come from auth context
const CLINIC_ID = 'clinic_1';

export default function Dashboard() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard')} - LubbMind</h1>
        <p className="text-muted-foreground">
          Système de gestion de clinique médicale
        </p>
      </div>
      
      <DashboardStats clinicId={CLINIC_ID} />
    </div>
  );
}
