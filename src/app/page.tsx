"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { JournalProvider, useJournal } from "@/context/JournalContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Layout from "@/components/Layout";
import Scene3D from "@/components/Scene3D";
import FloralDecoration from "@/components/FloralDecoration";
import WelcomeScreen from "@/components/WelcomeScreen";
import AuthScreen from "@/components/AuthScreen";

// Cambiamos @/pages por @/views
import Hoy from "@/views/Hoy";
import Semana from "@/views/Semana";
import Habitos from "@/views/Habitos";
import Devocional from "@/views/Devocional";
import Notas from "@/views/Notas";
import Admin from "@/views/Admin";

function HomeContent() {
  const { state, isAdmin } = useJournal();
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("hoy");
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const todayStr = new Date().toLocaleDateString();
      const savedDate = new Date(state.today.date).toLocaleDateString();
      if (savedDate !== todayStr || !state.today.mood) {
        setShowWelcome(true);
      }
    }
  }, [user, state.today.mood, state.today.date]);

  if (loadingAuth) return null;
  if (!user) return <AuthScreen />;

  const renderPage = () => {
    switch (activeTab) {
      case "hoy":        return <Hoy />;
      case "semana":     return <Semana />;
      case "habitos":    return <Habitos />;
      case "devocional": return <Devocional />;
      case "notas":      return <Notas />;
      case "admin":      return <Admin />;
      default:           return <Hoy />;
    }
  };

  return (
    <>
      <Scene3D />
      <FloralDecoration />

      <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
        {renderPage()}
      </Layout>

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-[#fffcf2]"
          >
            <WelcomeScreen onEnter={() => setShowWelcome(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <JournalProvider>
      <HomeContent />
    </JournalProvider>
  );
}
