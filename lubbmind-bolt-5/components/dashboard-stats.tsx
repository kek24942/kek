"use client"

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CircleCheck as CheckCircle, Clock, Users } from 'lucide-react';
import { useAppointments } from '@/hooks/useAppointments';
import { format } from 'date-fns';

interface DashboardStatsProps {
  clinicId: string;
}

export function DashboardStats({ clinicId }: DashboardStatsProps) {
  const { t } = useTranslation();
  const { appointments } = useAppointments(clinicId);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayAppointments = appointments.filter(apt => apt.date === today);
  const confirmedAppointments = todayAppointments.filter(apt => apt.status === 'confirmed');
  const waitingPatients = appointments.filter(apt => apt.status === 'waiting');
  const completedConsultations = todayAppointments.filter(apt => apt.status === 'completed');

  const stats = [
    {
      title: t('todayAppointments'),
      value: todayAppointments.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: t('confirmedAppointments'),
      value: confirmedAppointments.length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: t('waitingPatients'),
      value: waitingPatients.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: t('completedConsultations'),
      value: completedConsultations.length,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}