import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Appointment } from '@/lib/types';
import { format, isBefore, startOfDay } from 'date-fns';

export function useAppointments(clinicId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [deletedAppointments, setDeletedAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) return;

    const q = query(
      collection(db, 'appointments'),
      where('clinicId', '==', clinicId),
      orderBy('date', 'desc'),
      orderBy('time', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allAppointments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        deletedAt: doc.data().deletedAt?.toDate() || null,
        arrivalTime: doc.data().arrivalTime?.toDate() || null,
      })) as Appointment[];

      const active = allAppointments.filter(apt => !apt.deletedAt);
      const deleted = allAppointments.filter(apt => apt.deletedAt);

      setAppointments(active);
      setDeletedAppointments(deleted);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clinicId]);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Check for double booking
    const existingQuery = query(
      collection(db, 'appointments'),
      where('clinicId', '==', clinicId),
      where('date', '==', appointmentData.date),
      where('time', '==', appointmentData.time),
      where('status', 'in', ['pending', 'confirmed', 'waiting'])
    );
    
    const existingDocs = await getDocs(existingQuery);
    if (!existingDocs.empty) {
      throw new Error('timeSlotTaken');
    }

    const now = Timestamp.now();
    await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: now,
      updatedAt: now,
    });
  };

  const updateAppointmentStatus = async (appointmentId: string, status: Appointment['status']) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (status === 'waiting') {
      const arrivalTime = Timestamp.now();
      const today = format(new Date(), 'yyyy-MM-dd');

      const todayWaitingQuery = query(
        collection(db, 'appointments'),
        where('clinicId', '==', clinicId),
        where('date', '==', today),
        where('status', '==', 'waiting')
      );

      const waitingDocs = await getDocs(todayWaitingQuery);
      const nextOrderNumber = waitingDocs.size + 1;
      const arrivalOrder = nextOrderNumber.toString().padStart(3, '0');

      updateData.arrivalTime = arrivalTime;
      updateData.arrivalOrder = arrivalOrder;
    }

    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, updateData);

    if (status === 'completed') {
      if (appointment) {
        const existingPatientQuery = query(
          collection(db, 'patients'),
          where('phoneNumber', '==', appointment.phoneNumber),
          where('clinicId', '==', appointment.clinicId)
        );

        const existingPatientDocs = await getDocs(existingPatientQuery);

        if (existingPatientDocs.empty) {
          await addDoc(collection(db, 'patients'), {
            name: appointment.patientName,
            surname: appointment.patientSurname,
            phoneNumber: appointment.phoneNumber,
            clinicId: appointment.clinicId,
            createdAt: Timestamp.now(),
          });
        }
      }
    }
  };

  const getTodayAppointments = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return appointments.filter(apt => apt.date === today);
  };

  const getAppointmentsByStatus = (status: Appointment['status']) => {
    return appointments.filter(apt => apt.status === status);
  };

<<<<<<< HEAD
  const softDeleteAppointment = async (appointmentId: string, userId: string) => {
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      deletedAt: Timestamp.now(),
      deletedBy: userId,
      updatedAt: Timestamp.now(),
    });
  };

  const updateAppointment = async (
    appointmentId: string,
    updates: Partial<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'deletedBy'>>
  ) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    if (!canEditAppointment(appointment)) {
      throw new Error('cannotEditPastAppointment');
    }

    if (updates.date && updates.time) {
      const existingQuery = query(
        collection(db, 'appointments'),
        where('clinicId', '==', clinicId),
        where('date', '==', updates.date),
        where('time', '==', updates.time),
        where('status', 'in', ['pending', 'confirmed', 'waiting'])
      );

      const existingDocs = await getDocs(existingQuery);
      const hasConflict = existingDocs.docs.some(d => d.id !== appointmentId);

      if (hasConflict) {
        throw new Error('timeSlotTaken');
      }
    }

    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  const canEditAppointment = (appointment: Appointment): boolean => {
    const appointmentDate = new Date(appointment.date);
    const today = startOfDay(new Date());
    return !isBefore(appointmentDate, today);
  };

  const getNextAvailableTimeSlot = (date: string): string | null => {
    const START_HOUR = 9;
    const END_HOUR = 17;
    const SLOT_DURATION = 30;

    const bookedSlots = appointments
      .filter(apt => apt.date === date && ['pending', 'confirmed', 'waiting'].includes(apt.status))
      .map(apt => apt.time);

    for (let hour = START_HOUR; hour < END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_DURATION) {
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        if (!bookedSlots.includes(timeSlot)) {
          return timeSlot;
        }
      }
    }

    return null;
  };

  return {
    appointments,
    deletedAppointments,
    loading,
    addAppointment,
    updateAppointmentStatus,
    getTodayAppointments,
    getAppointmentsByStatus,
    softDeleteAppointment,
    updateAppointment,
    canEditAppointment,
    getNextAvailableTimeSlot,
  };
}