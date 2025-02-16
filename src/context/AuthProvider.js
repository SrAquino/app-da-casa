"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth, signIn } from "../../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Adicione o estado de carregamento

  useEffect(() => {
    console.log("AuthProvider montado"); // <-- Verifica se está carregando
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Atualize o estado de carregamento
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      const userCredential = await signIn(email, password);
      setUser(userCredential); // Update user state on login
      console.log("Usuário logado:", user);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, handleSignIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
