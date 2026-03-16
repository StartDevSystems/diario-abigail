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
  history: [],
  habits: [
    { id: '1', name: 'Beber agua', emoji: '💧', completedDays: Array(7).fill(false) },
    { id: '2', name: 'Meditar', emoji: '🧘‍♀️', completedDays: Array(7).fill(false) },
    { id: '3', name: 'Ejercicio', emoji: '🏃‍♀️', completedDays: Array(7).fill(false) },
  ],
  notes: [],
  streak: 0,
  user: {
    name: "Abigail",
    bio: "Tu espacio seguro y personal ✨",
  },
  settings: {
    fontSize: 'medium',
    fontFamily: 'Lora',
    themeColor: '#e11d74',
  }
});

interface JournalContextType {
  state: JournalState;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  updateToday: (data: Partial<DayData>) => void;
  updateProfile: (data: { name?: string, bio?: string, avatar?: string }) => void;
  updateSettings: (data: Partial<JournalState['settings']>) => void;
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  addHabit: (name: string, emoji: string) => void;
  updateHabit: (id: string, name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  addNote: (content: string, tag?: string) => void;
  deleteNote: (id: string) => void;
  logout: () => void;
  getHistory: () => DayData[];
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

          // Asignar admin por email autorizado
          const ADMIN_EMAILS = ['michaelcs1093@gmail.com'];
          if (currentUser.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase()) && rawData.role !== 'admin') {
            await setDoc(docRef, { ...rawData, role: 'admin' }, { merge: true });
            rawData.role = 'admin';
          }

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
            notes: Array.isArray(rawData.notes) ? rawData.notes : [],
            history: Array.isArray(rawData.history) ? rawData.history : []
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

            // Archivar día anterior si tuvo actividad (mood)
            const newHistory = [...mergedState.history];
            if (mergedState.today.mood) {
              newHistory.push(mergedState.today);
            }
            const limitedHistory = newHistory.slice(-30);

            const newState: JournalState = {
              ...mergedState,
              history: limitedHistory,
              streak: newStreak,
              today: { ...getInitialDayData(), date: now.toISOString() },
            };
            setState(newState);
            if (currentUser) saveToFirebase(newState, currentUser);
          } else {
            setState(mergedState);
          }
        } else {
          const freshState = getInitialState();
          const googleName = currentUser.displayName?.split(' ')[0] || "Abigail";
          (freshState as any).user = { ...freshState.user, name: googleName };
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

  const updateProfile = (data: { name?: string, bio?: string, avatar?: string }) => {
    setState(prev => {
      const newState = { ...prev, user: { ...prev.user, ...data } as any };
      if (user) saveToFirebase(newState, user);
      return newState;
    });
  };

  const updateSettings = (data: Partial<JournalState['settings']>) => {
    setState(prev => {
      const newState = { ...prev, settings: { ...prev.settings, ...data } as any };
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

  const addNote = (content: string, tag?: string) => {
    setState(prev => {
      const newNote: Note = { id: Date.now().toString(), date: new Date().toISOString(), content, tag: (tag as any) || 'general' };
      const newState: JournalState = { ...prev, notes: [newNote, ...(Array.isArray(prev.notes) ? prev.notes : [])] };
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

  const getHistory = () => state.history || [];

  const getAllUsersData = async () => {
    const { collection, getDocs } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  return (
    <JournalContext.Provider value={{ 
      state, user, isAdmin, loading, updateToday, updateProfile, updateSettings, toggleHabitDay, 
      addHabit, updateHabit, deleteHabit, addNote, deleteNote, logout, getHistory, getAllUsersData 
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
