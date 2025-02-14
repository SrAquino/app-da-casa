"use client"; // Garante que é um Client Component

import { useAuth } from "../context/AuthProvider";

export default function ControleDeGastos() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Controle de Gastos</h1>
      {user ? (
        <p>Bem-vindo, {user.email}!</p>
      ) : (
        <p>Usuário não autenticado.</p>
      )}
    </div>
  );
}
