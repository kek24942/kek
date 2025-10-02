"use client"

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AppointmentForm } from '@/components/appointment-form';
import { useAppointments } from '@/hooks/useAppointments';
import { Plus, Check, Clock } from 'lucide-react';
import { format } from 'date-fns';

// Mock clinic ID - in real app, this would come from auth context
const CLINIC_ID = 'clinic_1';

export default function Appointments() {
  const { t } = useTranslation();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { appointments, updateAppointmentStatus } = useAppointments(CLINIC_ID);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'confirmed':
        return 'text-green-600 bg-green-50';
      case 'waiting':
        return 'text-blue-600 bg-blue-50';
      case 'completed':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('appointments')}</h1>
          <p className="text-muted-foreground">
            Gérer les rendez-vous des patients
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('addAppointment')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('name')}</TableHead>
                <TableHead>{t('surname')}</TableHead>
                <TableHead>{t('phone')}</TableHead>
                <TableHead>{t('date')}</TableHead>
                <TableHead>{t('time')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {appointment.patientName}
                  </TableCell>
                  <TableCell>{appointment.patientSurname}</TableCell>
                  <TableCell>{appointment.phoneNumber}</TableCell>
                  <TableCell>
                    {format(new Date(appointment.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {t(appointment.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, 'confirmed')
                          }
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {t('confirm')}
                        </Button>
                      )}
                      {appointment.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            updateAppointmentStatus(appointment.id, 'waiting')
                          }
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t('confirmArrival')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        clinicId={CLINIC_ID}
      />
    </div>
  );
}