"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { JournalState, Habit, Note, DayData } from '../types/index';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';

const INITIAL_DAY_DATA: DayData = {
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
};

const INITIAL_STATE: JournalState = {
  today: INITIAL_DAY_DATA,
  habits: [
    { id: '1', name: 'Beber agua', emoji: '💧', completedDays: Array(7).fill(false) },
    { id: '2', name: 'Meditar', emoji: '🧘‍♀️', completedDays: Array(7).fill(false) },
    { id: '3', name: 'Ejercicio', emoji: '🏃‍♀️', completedDays: Array(7).fill(false) },
  ],
  notes: [],
  streak: 0,
};

interface JournalContextType {
  state: JournalState;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  updateToday: (data: Partial<DayData>) => void;
  toggleHabitDay: (habitId: string, dayIndex: number) => void;
  addHabit: (name: string, emoji: string) => void;
  updateHabit: (id: string, name: string, emoji: string) => void;
  deleteHabit: (id: string) => void;
  addNote: (content: string) => void;
  deleteNote: (id: string) => void;
  logout: () => void;
  getAllUsersData: () => Promise<any[]>; // Solo para Admin
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<JournalState>(INITIAL_STATE);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const cloudData = docSnap.data() as any;
          setIsAdmin(cloudData.role === 'admin'); // Detectar si es admin
          
          const todayStr = new Date().toLocaleDateString();
          const savedDateStr = new Date(cloudData.today?.date || new Date()).toLocaleDateString();
          
          if (todayStr !== savedDateStr) {
            setState({
              ...cloudData,
              today: { ...INITIAL_DAY_DATA, date: new Date().toISOString() },
            });
          } else {
            setState(cloudData);
          }
        } else {
          await setDoc(docRef, { ...INITIAL_STATE, role: 'user' });
          setState(INITIAL_STATE);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && !loading) {
      const saveToCloud = async () => {
        const docRef = doc(db, "users", user.uid);
        await setDoc(docRef, state, { merge: true });
      };
      saveToCloud();
    }
  }, [state, user, loading]);

  const getAllUsersData = async () => {
    if (!isAdmin) return [];
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  const updateToday = (data: Partial<DayData>) => setState(prev => ({ ...prev, today: { ...prev.today, ...data } }));
  const toggleHabitDay = (habitId: string, dayIndex: number) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === habitId ? { ...h, completedDays: h.completedDays.map((d, i) => i === dayIndex ? !d : d) } : h)
    }));
  };
  const addHabit = (name: string, emoji: string) => {
    const newHabit = { id: Date.now().toString(), name, emoji, completedDays: Array(7).fill(false) };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };
  const updateHabit = (id: string, name: string, emoji: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.map(h => h.id === id ? { ...h, name, emoji } : h) }));
  };
  const deleteHabit = (id: string) => setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  const addNote = (content: string) => {
    const newNote = { id: Date.now().toString(), date: new Date().toISOString(), content };
    setState(prev => ({ ...prev, notes: [newNote, ...prev.notes] }));
  };
  const deleteNote = (id: string) => setState(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== id) }));
  const logout = () => auth.signOut();

  return (
    <JournalContext.Provider value={{ 
      state, user, isAdmin, loading, updateToday, toggleHabitDay, 
      addHabit, updateHabit, deleteHabit, addNote, deleteNote, logout, getAllUsersData 
    }}>
      {!loading && children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) throw new Error('useJournal must be used within a JournalProvider');
  return context;
};
