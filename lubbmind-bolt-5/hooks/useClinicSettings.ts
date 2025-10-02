import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ClinicSettings } from '@/lib/types';

export function useClinicSettings(clinicId: string) {
  const [settings, setSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clinicId) return;

    const q = query(
      collection(db, 'clinicSettings'),
      where('clinicId', '==', clinicId)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        const defaultSettings = {
          clinicId,
          visitFee: 3000,
          currency: 'DA',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        };
        const docRef = await addDoc(collection(db, 'clinicSettings'), defaultSettings);
        setSettings({
          id: docRef.id,
          ...defaultSettings,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as ClinicSettings);
      } else {
        const doc = snapshot.docs[0];
        setSettings({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as ClinicSettings);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clinicId]);

  const updateSettings = async (updates: Partial<ClinicSettings>) => {
    if (!settings) return;

    const settingsRef = doc(db, 'clinicSettings', settings.id);
    await updateDoc(settingsRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  };

  return {
    settings,
    loading,
    updateSettings,
  };
}
