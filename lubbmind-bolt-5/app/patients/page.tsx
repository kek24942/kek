"use client"

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Patient } from '@/lib/types';

// Mock clinic ID - in real app, this would come from auth context
const CLINIC_ID = 'clinic_1';

export default function Patients() {
  const { t } = useTranslation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'patients'),
      where('clinicId', '==', CLINIC_ID)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Patient[];
      
      setPatients(patientsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('patients')}</h1>
        <p className="text-muted-foreground">
          Liste des patients enregistrés
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients enregistrés ({patients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun patient enregistré
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('surname')}</TableHead>
                  <TableHead>{t('phone')}</TableHead>
                  <TableHead>Date d'enregistrement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell>{patient.surname}</TableCell>
                    <TableCell>{patient.phoneNumber}</TableCell>
                    <TableCell>
                      {patient.createdAt?.toLocaleDateString('fr-FR')}
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