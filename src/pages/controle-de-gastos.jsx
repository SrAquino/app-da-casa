"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getUsers, getExpenses, addExpense } from '../../firebaseConfig';
import { useAuth } from '../context/AuthProvider'; // Import useAuth
import styles from '@/styles/controle-de-gastos.module.scss';

const ControleDeGastos = () => {
  const [users, setUsers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ date: '', value: '', category: '' });
  const { user } = useAuth(); // Get the authenticated user

  useEffect(() => {
    // Fetch users and expenses from Firestore
    getUsers()
      .then(fetchedUsers => setUsers(fetchedUsers))
      .catch(error => console.error('Error fetching users:', error));

    getExpenses()
      .then(fetchedExpenses => setExpenses(fetchedExpenses))
      .catch(error => console.error('Error fetching expenses:', error));
  }, []);

  const addExpenseToDB = () => {
    if (!newExpense.date || !newExpense.value || !newExpense.category) return;

    const username = user.email.split('@')[0]; // Extract username from email
    const expense = { ...newExpense, user: username };

    // Save new expense to Firestore
    addExpense(expense)
      .then(addedExpense => {
        setExpenses([...expenses, addedExpense]);
        setNewExpense({ date: '', value: '', category: '' });
      })
      .catch(error => console.error('Error adding expense:', error));
  };

  const categorizedExpenses = users.reduce((acc, user) => {
    const username = user.email.split('@')[0]; // Extract username from email
    acc[username] = expenses.filter(expense => expense.user === username);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <div>
          <h1>Controle de Gastos</h1>
          {user ? (
            <p>Bem-vindo, {user.email}!</p>
          ) : (
            <p>Usuário não autenticado.</p>
          )}
        </div>
        <div className={styles.expensesContainer}>
          {users.map(user => {
            const username = user.email.split('@')[0]; // Extract username from email
            return (
              <div key={user.email} className={styles.userColumn}>
                <h2>{user.name}</h2>
                <ul className={styles.expensesList}>
                  {categorizedExpenses[username]?.map(expense => (
                    <li key={expense.id} className={styles.expenseItem}>
                      {expense.date} | {expense.value} | {expense.category}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className={styles.addExpense}>
          <h2>Adicionar Gasto</h2>
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className={styles.input}
          />
          <input
            type="number"
            value={newExpense.value}
            onChange={(e) => setNewExpense({ ...newExpense, value: e.target.value })}
            placeholder="Valor"
            className={styles.input}
          />
          <input
            type="text"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            placeholder="Categoria"
            className={styles.input}
          />
          <button onClick={addExpenseToDB} className={styles.button}>Adicionar</button>
        </div>
      </div>
    </div>
  );
};

export default ControleDeGastos;
