"use client"

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppointments } from '@/hooks/useAppointments';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock clinic ID - in real app, this would come from auth context
const CLINIC_ID = 'clinic_1';

export default function Reports() {
  const { t } = useTranslation();
  const { appointments } = useAppointments(CLINIC_ID);

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const monthlyAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= monthStart && aptDate <= monthEnd;
  });

  const completedThisMonth = monthlyAppointments.filter(apt => apt.status === 'completed');
  const totalRevenue = completedThisMonth.length * 3000; // Assuming 3000 DA per consultation

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('reports')}</h1>
        <p className="text-muted-foreground">
          Rapports et statistiques de la clinique
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rendez-vous ce mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyAppointments.length}</div>
            <p className="text-sm text-muted-foreground">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consultations terminées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedThisMonth.length}</div>
            <p className="text-sm text-muted-foreground">
              Ce mois-ci
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenus estimés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DA</div>
            <p className="text-sm text-muted-foreground">
              Basé sur les consultations terminées
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistiques par statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['pending', 'confirmed', 'waiting', 'completed'].map(status => {
              const count = monthlyAppointments.filter(apt => apt.status === status).length;
              const percentage = monthlyAppointments.length > 0 
                ? (count / monthlyAppointments.length * 100).toFixed(1)
                : 0;
              
              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize">{t(status)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                    <span className="font-medium">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}