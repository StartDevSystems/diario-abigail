"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalState, Habit, Note, DayData } from '../types/index';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getInitialDayData = (): DayData => ({
  date: new Date().toISOString(),
  mood: null,
  priorities: ['', '', ''],
  tasks: [],
  gratitude: ['', '', ''],
  devocionalVerse: "Cargando palabra de Dios...",
  devocionalRef: "",
  devocionalReflection: '',
  prayerThanks: '',
  prayerAsk: '',
  prayerDecree: '',
});

const getInitialState = (): JournalState => ({
  today: getInitialDayData(),
  habits: [
    { id: '1', name: 'Beber agua', emoji: '💧', completedDays: Array(7).fill(false) },
    { id: '2', name: 'Meditar', emoji: '🧘‍♀️', completedDays: Array(7).fill(false) },
    { id: '3', name: 'Ejercicio', emoji: '🏃‍♀️', completedDays: Array(7).fill(false) },
  ],
  notes: [],
  streak: 0,
});

interface JournalContextType {
  state: JournalState;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  updateToday: (data: Partial<DayData>) => void;
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  addHabit: (name: string, emoji: string) => void;
  updateHabit: (id: string, name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  logout: () => void;
  getAllUsersData: () => Promise<any[]>;
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<JournalState>(getInitialState());
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sincronización con Firestore
  const saveToFirebase = async (newState: JournalState, currentUser: User) => {
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, newState, { merge: true });
    } catch (e) {
      console.error("Error saving to Firebase", e);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const rawData = docSnap.data() as any;
          setIsAdmin(rawData.role === 'admin');
          
          // --- LIMPIEZA PROFUNDA ---
          const cleanHabits = Array.isArray(rawData.habits) 
            ? rawData.habits.map((h: any) => ({
                ...h,
                completedDays: Array.isArray(h.completedDays) ? h.completedDays : (Array.isArray(h.completed_days) ? h.completed_days : Array(7).fill(false))
              }))
            : getInitialState().habits;

          const mergedState: JournalState = {
            ...getInitialState(),
            ...rawData,
            habits: cleanHabits,
            today: { ...getInitialDayData(), ...(rawData.today || {}) },
            notes: Array.isArray(rawData.notes) ? rawData.notes : []
          };

          const now = new Date();
          const todayStr = now.toLocaleDateString();
          const lastDate = new Date(mergedState.today.date || now);
          
          if (todayStr !== lastDate.toLocaleDateString()) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            let newStreak = mergedState.streak || 0;
            if (lastDate.toLocaleDateString() !== yesterday.toLocaleDateString() || !mergedState.today.mood) {
              newStreak = 0;
            }

            const newState = {
              ...mergedState,
              streak: newStreak,
              today: { ...getInitialDayData(), date: now.toISOString() },
            };
            setState(newState);
          } else {
            setState(mergedState);
          }
        } else {
          const freshState = getInitialState();
          await setDoc(docRef, { ...freshState, role: 'user' });
          setState(freshState);
        }
      } else {
        setState(getInitialState());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateToday = (data: Partial<DayData>) => {
    setState(prev => {
      const currentToday = prev.today || getInitialDayData();
      let extra = {};
      if (data.mood && !currentToday.mood) {
        extra = { streak: (prev.streak || 0) + 1 };
      }
      const newState = { ...prev, ...extra, today: { ...currentToday, ...data } };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setState(prev => {
      const habits = Array.isArray(prev.habits) ? prev.habits : [];
      const newHabits = habits.map(h => {
        if (h.id !== habitId) return h;
        const currentDays = Array.isArray(h.completedDays) ? h.completedDays : Array(7).fill(false);
        const newDays = [...currentDays];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, completedDays: newDays };
      });
      const newState = { ...prev, habits: newHabits };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const addHabit = (name: string, emoji: string) => {
    setState(prev => {
      const newHabit = { id: Date.now().toString(), name, emoji, completedDays: Array(7).fill(false) };
      const newState = { ...prev, habits: [...(Array.isArray(prev.habits) ? prev.habits : []), newHabit] };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const updateHabit = (id: string, name: string, emoji: string) => {
    setState(prev => {
      const habits = Array.isArray(prev.habits) ? prev.habits : [];
      const newHabits = habits.map(h => h.id === id ? { ...h, name, emoji } : h);
      const newState = { ...prev, habits: newHabits };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const deleteHabit = (id: string) => {
    setState(prev => {
      const newState = { ...prev, habits: (Array.isArray(prev.habits) ? prev.habits : []).filter(h => h.id !== id) };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const addNote = (content: string) => {
    setState(prev => {
      const newNote = { id: Date.now().toString(), date: new Date().toISOString(), content };
      const newState = { ...prev, notes: [newNote, ...(Array.isArray(prev.notes) ? prev.notes : [])] };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const deleteNote = (id: string) => {
    setState(prev => {
      const newState = { ...prev, notes: (Array.isArray(prev.notes) ? prev.notes : []).filter(n => n.id !== id) };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const logout = () => auth.signOut();

  const getAllUsersData = async () => {
    const { collection, getDocs } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <JournalContext.Provider value={{ 
      state, user, isAdmin, loading, updateToday, toggleHabitDay, 
      addHabit, updateHabit, deleteHabit, addNote, deleteNote, logout, getAllUsersData 
    }}>
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) throw new Error('useJournal must be used within a JournalProvider');
  return context;
};
