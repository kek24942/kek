import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de bord',
      patients: 'Patients',
      appointments: 'Rendez-vous',
      reports: 'Rapports',
      waitingRoom: 'Salle d\'attente',
      
      // Dashboard
      todayAppointments: 'Rendez-vous aujourd\'hui',
      confirmedAppointments: 'Confirmés',
      waitingPatients: 'En attente',
      completedConsultations: 'Consultations terminées',
      
      // Appointments
      addAppointment: 'Ajouter un rendez-vous',
      patientName: 'Nom du patient',
      patientSurname: 'Prénom du patient',
      phoneNumber: 'Numéro de téléphone',
      appointmentDate: 'Date du rendez-vous',
      appointmentTime: 'Heure du rendez-vous',
      save: 'Enregistrer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      complete: 'Terminer',
      confirmArrival: 'Confirmer l\'arrivée',
      markCompleted: 'Marquer comme terminé',
      
      // Status
      pending: 'En attente',
      confirmed: 'Confirmé',
      waiting: 'En salle d\'attente',
      completed: 'Terminé',
      
      // Messages
      appointmentAdded: 'Rendez-vous ajouté avec succès',
      appointmentConfirmed: 'Rendez-vous confirmé',
      appointmentCompleted: 'Consultation terminée',
      timeSlotTaken: 'Ce créneau horaire est déjà pris',
      
      // Common
      name: 'Nom',
      surname: 'Prénom',
      phone: 'Téléphone',
      date: 'Date',
      time: 'Heure',
      status: 'Statut',
      actions: 'Actions',
    }
  },
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      patients: 'Patients',
      appointments: 'Appointments',
      reports: 'Reports',
      waitingRoom: 'Waiting Room',
      
      // Dashboard
      todayAppointments: 'Today\'s Appointments',
      confirmedAppointments: 'Confirmed',
      waitingPatients: 'Waiting',
      completedConsultations: 'Completed Consultations',
      
      // Appointments
      addAppointment: 'Add Appointment',
      patientName: 'Patient Name',
      patientSurname: 'Patient Surname',
      phoneNumber: 'Phone Number',
      appointmentDate: 'Appointment Date',
      appointmentTime: 'Appointment Time',
      save: 'Save',
      cancel: 'Cancel',
      confirm: 'Confirm',
      complete: 'Complete',
      confirmArrival: 'Confirm Arrival',
      markCompleted: 'Mark as Completed',
      
      // Status
      pending: 'Pending',
      confirmed: 'Confirmed',
      waiting: 'Waiting',
      completed: 'Completed',
      
      // Messages
      appointmentAdded: 'Appointment added successfully',
      appointmentConfirmed: 'Appointment confirmed',
      appointmentCompleted: 'Consultation completed',
      timeSlotTaken: 'This time slot is already taken',
      
      // Common
      name: 'Name',
      surname: 'Surname',
      phone: 'Phone',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
    }
  },
  ar: {
    translation: {
      // Navigation
      dashboard: 'لوحة التحكم',
      patients: 'المرضى',
      appointments: 'المواعيد',
      reports: 'التقارير',
      waitingRoom: 'غرفة الانتظار',
      
      // Dashboard
      todayAppointments: 'مواعيد اليوم',
      confirmedAppointments: 'مؤكدة',
      waitingPatients: 'في الانتظار',
      completedConsultations: 'الاستشارات المكتملة',
      
      // Appointments
      addAppointment: 'إضافة موعد',
      patientName: 'اسم المريض',
      patientSurname: 'لقب المريض',
      phoneNumber: 'رقم الهاتف',
      appointmentDate: 'تاريخ الموعد',
      appointmentTime: 'وقت الموعد',
      save: 'حفظ',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      complete: 'إكمال',
      confirmArrival: 'تأكيد الوصول',
      markCompleted: 'تحديد كمكتمل',
      
      // Status
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      waiting: 'في غرفة الانتظار',
      completed: 'مكتمل',
      
      // Messages
      appointmentAdded: 'تم إضافة الموعد بنجاح',
      appointmentConfirmed: 'تم تأكيد الموعد',
      appointmentCompleted: 'تم إكمال الاستشارة',
      timeSlotTaken: 'هذا الوقت محجوز بالفعل',
      
      // Common
      name: 'الاسم',
      surname: 'اللقب',
      phone: 'الهاتف',
      date: 'التاريخ',
      time: 'الوقت',
      status: 'الحالة',
      actions: 'الإجراءات',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;