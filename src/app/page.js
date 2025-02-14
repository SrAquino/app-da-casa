"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { useAuth } from "../context/AuthProvider";
import '@/styles/global.scss'
import '@/styles/page.scss'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { handleSignIn } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await handleSignIn(email, password);
      router.push("/controle-de-gastos"); // Redirect to controle-de-gastos page
    } catch (err) {
      setError("E-mail ou senha incorretos.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
