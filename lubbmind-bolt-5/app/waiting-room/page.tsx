"use client"

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
import { useAppointments } from '@/hooks/useAppointments';
import { CircleCheck as CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

// Mock clinic ID - in real app, this would come from auth context
const CLINIC_ID = 'clinic_1';

export default function WaitingRoom() {
  const { t } = useTranslation();
  const { appointments, updateAppointmentStatus } = useAppointments(CLINIC_ID);

  const waitingPatients = appointments
    .filter(apt => apt.status === 'waiting')
    .sort((a, b) => {
      const orderA = parseInt(a.arrivalOrder || '999');
      const orderB = parseInt(b.arrivalOrder || '999');
      return orderA - orderB;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('waitingRoom')}</h1>
        <p className="text-muted-foreground">
          Patients en attente de consultation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients en attente ({waitingPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {waitingPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun patient en attente
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('surname')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead>{t('appointmentTime')}</TableHead>
                  <TableHead>Arrival Time</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitingPatients.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-bold text-lg">
                      #{appointment.arrivalOrder || '-'}
                    </TableCell>
                    <TableCell className="font-medium">
                      {appointment.patientName}
                    </TableCell>
                    <TableCell>{appointment.patientSurname}</TableCell>
                    <TableCell>{appointment.phoneNumber}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>
                      {appointment.arrivalTime ? format(appointment.arrivalTime, 'HH:mm') : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateAppointmentStatus(appointment.id, 'completed')
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t('markCompleted')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}