"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { JournalProvider, useJournal } from "@/context/JournalContext";
import Layout from "@/components/Layout";
import Scene3D from "@/components/Scene3D";
import FloralDecoration from "@/components/FloralDecoration";
import WelcomeScreen from "@/components/WelcomeScreen";
import AuthScreen from "@/components/AuthScreen";

import Hoy from "@/views/Hoy";
import Semana from "@/views/Semana";
import Habitos from "@/views/Habitos";
import Devocional from "@/views/Devocional";
import Notas from "@/views/Notas";
import Admin from "@/views/Admin";
import Configuracion from "@/views/Configuracion";

function HomeContent() {
  const { state, user, loading, isAdmin } = useJournal();
  const [activeTab, setActiveTab] = useState<string>("hoy");
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      const todayStr = new Date().toLocaleDateString();
      const savedDate = new Date(state.today.date).toLocaleDateString();
      
      if (savedDate !== todayStr || !state.today.mood) {
        setShowWelcome(true);
      } else {
        setShowWelcome(false);
      }
    }
  }, [loading, user, state.today.mood, state.today.date]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fffcf2]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-deep-rose font-serif italic text-xl"
        >
          Preparando tu diario...
        </motion.div>
      </div>
    );
  }

  if (!user) return <AuthScreen />;

  const renderPage = () => {
    switch (activeTab) {
      case "hoy":           return <Hoy />;
      case "semana":        return <Semana />;
      case "habitos":       return <Habitos />;
      case "devocional":    return <Devocional />;
      case "notas":         return <Notas />;
      case "admin":         return <Admin />;
      case "configuracion": return <Configuracion />;
      default:              return <Hoy />;
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
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
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
