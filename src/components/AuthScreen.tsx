"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
          // Guardar nombre en Firestore directamente para evitar race condition
          const userDocRef = doc(db, "users", userCredential.user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            await setDoc(userDocRef, { user: { name, bio: "Tu espacio seguro y personal ✨" } }, { merge: true });
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("Error: Verifica tus credenciales o conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#fffcf2] floral-pattern">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white p-10 rounded-[3rem] shadow-2xl border border-rose-pastel/50"
      >
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-12 rounded-full bg-rose-pastel flex items-center justify-center mb-6 shadow-sm">
            <Heart className="text-deep-rose fill-deep-rose/20" size={32} />
          </div>
          <h1 className="text-3xl font-serif text-deep-rose italic font-bold">
            {isLogin ? "¡Bienvenida de vuelta!" : "Crea tu espacio sagrado"}
          </h1>
          <p className="text-soft-text/60 text-sm mt-2 font-medium">
            {isLogin ? "Tu diario te ha extrañado" : "Comienza tu viaje de crecimiento hoy"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-pink group-focus-within:text-deep-rose transition-colors" size={18} />
              <input 
                type="text" required placeholder="Tu nombre"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full bg-rose-pastel/20 border-2 border-transparent focus:border-rose-pastel rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-soft-text"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-pink group-focus-within:text-deep-rose transition-colors" size={18} />
            <input 
              type="email" required placeholder="Correo electrónico"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-rose-pastel/20 border-2 border-transparent focus:border-rose-pastel rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-soft-text"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent-pink group-focus-within:text-deep-rose transition-colors" size={18} />
            <input 
              type="password" required placeholder="Tu contraseña"
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-rose-pastel/20 border-2 border-transparent focus:border-rose-pastel rounded-2xl py-4 pl-12 pr-4 outline-none transition-all font-medium text-soft-text"
            />
          </div>

          {error && <p className="text-red-400 text-xs font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

          <button 
            type="submit" disabled={loading}
            className="w-full bg-deep-rose hover:bg-pink-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-deep-rose/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? "Procesando..." : (isLogin ? "Entrar" : "Empezar ahora")}
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-soft-text/40 hover:text-deep-rose text-sm font-bold underline transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
