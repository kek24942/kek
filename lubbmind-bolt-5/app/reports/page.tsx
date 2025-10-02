"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppointments } from '@/hooks/useAppointments';
import { useClinicSettings } from '@/hooks/useClinicSettings';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Settings } from 'lucide-react';

const CLINIC_ID = 'clinic_1';

export default function Reports() {
  const { t } = useTranslation();
  const { appointments } = useAppointments(CLINIC_ID);
  const { settings, updateSettings } = useClinicSettings(CLINIC_ID);
  const [isEditingFee, setIsEditingFee] = useState(false);
  const [newFee, setNewFee] = useState('');

  const visitFee = settings?.visitFee || 3000;

  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  const monthlyCompleted = completedAppointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= monthStart && aptDate <= monthEnd;
  });

  const todayCompleted = completedAppointments.filter(apt =>
    apt.date === format(new Date(), 'yyyy-MM-dd')
  );

  const dailyIncome = todayCompleted.length * visitFee;
  const monthlyIncome = monthlyCompleted.length * visitFee;

  const dailyData = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayCompleted = completedAppointments.filter(apt => apt.date === dayStr);
    return {
      date: format(day, 'dd/MM'),
      appointments: dayCompleted.length,
      income: dayCompleted.length * visitFee,
    };
  });

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const start = startOfMonth(month);
    const end = endOfMonth(month);
    const monthCompleted = completedAppointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= start && aptDate <= end;
    });
    return {
      month: format(month, 'MMM', { locale: fr }),
      appointments: monthCompleted.length,
      income: monthCompleted.length * visitFee,
    };
  });

  const handleUpdateFee = async () => {
    const fee = parseFloat(newFee);
    if (fee && fee > 0) {
      await updateSettings({ visitFee: fee });
      setIsEditingFee(false);
      setNewFee('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('reports')}</h1>
          <p className="text-muted-foreground">
            Rapports et statistiques de la clinique
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Clinic Settings</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingFee(!isEditingFee)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Visit Fee
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditingFee ? (
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="visitFee">Visit Fee ({settings?.currency || 'DA'})</Label>
                <Input
                  id="visitFee"
                  type="number"
                  value={newFee}
                  onChange={(e) => setNewFee(e.target.value)}
                  placeholder={visitFee.toString()}
                />
              </div>
              <Button onClick={handleUpdateFee}>Save</Button>
              <Button variant="outline" onClick={() => setIsEditingFee(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="text-lg">
              <span className="text-muted-foreground">Current Visit Fee: </span>
              <span className="font-bold">{visitFee.toLocaleString()} {settings?.currency || 'DA'}</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Today's Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailyIncome.toLocaleString()} {settings?.currency || 'DA'}</div>
            <p className="text-sm text-muted-foreground">
              {todayCompleted.length} completed consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyIncome.toLocaleString()} {settings?.currency || 'DA'}</div>
            <p className="text-sm text-muted-foreground">
              {monthlyCompleted.length} completed consultations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCompleted.length}</div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(), 'dd MMMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyCompleted.length}</div>
            <p className="text-sm text-muted-foreground">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Appointments (Current Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="appointments" fill="#3b82f6" name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Income (Current Month)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10b981" name={`Income (${settings?.currency || 'DA'})`} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Last 6 Months Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last6Months}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="appointments" fill="#3b82f6" name="Appointments" />
              <Bar yAxisId="right" dataKey="income" fill="#10b981" name={`Income (${settings?.currency || 'DA'})`} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
