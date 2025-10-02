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
import { format } from 'date-fns';

export function useAppointments(clinicId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
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
      const appointmentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as Appointment[];
      
      setAppointments(appointmentsData);
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
    const appointmentRef = doc(db, 'appointments', appointmentId);
    await updateDoc(appointmentRef, {
      status,
      updatedAt: Timestamp.now(),
    });

    // Create patient record when appointment is confirmed
    if (status === 'confirmed') {
      const appointment = appointments.find(a => a.id === appointmentId);
      if (appointment) {
        await addDoc(collection(db, 'patients'), {
          name: appointment.patientName,
          surname: appointment.patientSurname,
          phoneNumber: appointment.phoneNumber,
          clinicId: appointment.clinicId,
          createdAt: Timestamp.now(),
        });
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

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointmentStatus,
    getTodayAppointments,
    getAppointmentsByStatus,
  };
}