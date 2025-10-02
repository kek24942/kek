"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppointments } from '@/hooks/useAppointments';

const appointmentSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters'),
  patientSurname: z.string().min(2, 'Surname must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  clinicId: string;
}

export function AppointmentForm({ isOpen, onClose, clinicId }: AppointmentFormProps) {
  const { t } = useTranslation();
  const { addAppointment } = useAppointments(clinicId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await addAppointment({
        ...data,
        status: 'pending',
        clinicId,
      });
      reset();
      onClose();
    } catch (err: any) {
      if (err.message === 'timeSlotTaken') {
        setError(t('timeSlotTaken'));
      } else {
        setError('An error occurred while adding the appointment');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('addAppointment')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">{t('patientName')}</Label>
              <Input
                id="patientName"
                {...register('patientName')}
                placeholder={t('patientName')}
              />
              {errors.patientName && (
                <p className="text-sm text-destructive">{errors.patientName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patientSurname">{t('patientSurname')}</Label>
              <Input
                id="patientSurname"
                {...register('patientSurname')}
                placeholder={t('patientSurname')}
              />
              {errors.patientSurname && (
                <p className="text-sm text-destructive">{errors.patientSurname.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder={t('phoneNumber')}
              type="tel"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">{t('appointmentDate')}</Label>
              <Input
                id="date"
                {...register('date')}
                type="date"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">{t('appointmentTime')}</Label>
              <Input
                id="time"
                {...register('time')}
                type="time"
              />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time.message}</p>
              )}
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}