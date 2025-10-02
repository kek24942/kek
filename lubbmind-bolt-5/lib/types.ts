export interface Appointment {
  id: string;
  patientName: string;
  patientSurname: string;
  phoneNumber: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'waiting' | 'completed';
  createdAt: Date;
  updatedAt: Date;
  clinicId: string;
  deletedAt?: Date | null;
  deletedBy?: string | null;
  arrivalTime?: Date | null;
  arrivalOrder?: string | null;
}

export interface Patient {
  id: string;
  name: string;
  surname: string;
  phoneNumber: string;
  createdAt: Date;
  clinicId: string;
}

export interface DashboardStats {
  todayAppointments: number;
  confirmedAppointments: number;
  waitingPatients: number;
  completedConsultations: number;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'doctor' | 'assistant';
  clinicId: string;
  name: string;
}

export interface ClinicSettings {
  id: string;
  clinicId: string;
  visitFee: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}