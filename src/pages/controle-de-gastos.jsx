"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute
import { getUsers, getExpenses, addExpense } from '../../firebaseConfig';
import { useAuth } from '../context/AuthProvider'; // Import useAuth
import styles from '@/styles/controle-de-gastos.module.scss';

const ControleDeGastos = () => {

  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], value: '', category: '', description: '', type: 'Total', selectedUsers: [] });
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedUser, setSelectedUser] = useState('');
  const { user } = useAuth(); // Get the authenticated user

  const categories = ['Mercado', 'Açougue', 'Padaria', 'Horti', 'Pet', 'Contas', 'Lazer', 'Transporte', 'Outros', 'Relação passada'];
  const expenseTypes = ['Total', 'Individual', 'Selecionados'];

  useEffect(() => {

    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const collectionName = `${month}${year}`;

      // Fetch expenses for the selected month from Firestore
      getExpenses(collectionName)
        .then(fetchedExpenses => setExpenses(fetchedExpenses))
        .catch(error => console.error('Error fetching expenses:', error));
    }
  }, [selectedMonth]);

  const addExpenseToDB = () => {
    if (!newExpense.date || !newExpense.value || !newExpense.category) return;

    const username = user.email.split('@')[0]; // Extract username from email
    const [year, month] = newExpense.date.split('-');
    const expense = { ...newExpense, user: username };

    // Save new expense to Firestore in a collection for the specific month
    addExpense(expense, `${month}${year}`)
      .then(addedExpense => {
        setExpenses([...expenses, addedExpense]);
        setNewExpense({ date: new Date().toISOString().split('T')[0], value: '', category: '', description: '', type: 'Total', selectedUsers: [] });
      })
      .catch(error => console.error('Error adding expense:', error));
  };

  const getDaysInMonth = (month) => {
    const [year, monthIndex] = month.split('-');
    return new Date(year, monthIndex, 0).getDate();
  };

  const daysInMonth = selectedMonth ? getDaysInMonth(selectedMonth) : 0;

  const userExpenses = expenses.filter(expense => expense.user === selectedUser);
  const totalExpense = userExpenses.reduce((sum, expense) => sum + parseFloat(expense.value), 0);

  const usersWithExpenses = [...new Set(expenses.map(expense => expense.user))];

  const formatCurrency = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setNewExpense(prevExpense => ({
      ...prevExpense,
      category,
      type: category === 'Relação passada' ? 'Selecionados' : prevExpense.type,
      selectedUsers: category === 'Relação passada' ? prevExpense.selectedUsers.slice(0, 1) : prevExpense.selectedUsers
    }));
  };

  const handleCheckboxChange = (user) => {
    setNewExpense(prevExpense => {
      let selectedUsers;
      if (prevExpense.category === 'Relação passada') {
        selectedUsers = prevExpense.selectedUsers.includes(user)
          ? []
          : [user];
      } else {
        selectedUsers = prevExpense.selectedUsers.includes(user)
          ? prevExpense.selectedUsers.filter(u => u !== user)
          : [...prevExpense.selectedUsers, user];
      }
      return { ...prevExpense, selectedUsers };
    });
  };

  return (
    <ProtectedRoute>
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
          <div>
            <label htmlFor="month">Selecione o mês:</label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className={styles.input}
            />
          </div>
          <div>
            <label htmlFor="user">Selecione o usuário:</label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className={styles.input}
            >
              <option value="">Selecione um usuário</option>
              {usersWithExpenses.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          {selectedUser && (
            <div className={styles.userTable}>
              <h2>Gastos de {selectedUser}</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Dia</th> {/* Alterado para "Dia" */}
                    <th>Gasto</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Divisão</th> {/* Nova coluna adicionada */}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = `${selectedMonth}-${String(i + 1).padStart(2, '0')}`;
                    const dailyExpenses = userExpenses.filter(expense => expense.date === date);
                    const dailyTotal = dailyExpenses.reduce((sum, expense) => sum + parseFloat(expense.value), 0);

                    return (
                      <tr key={date} className={i % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td>{String(i + 1).padStart(2, '0')}</td> {/* Exibe apenas o dia */}
                        <td>{formatCurrency(dailyTotal)}</td>
                        <td>
                          {dailyExpenses.map(expense => (
                            <div key={expense.id}>{expense.category}</div>
                          ))}
                        </td>
                        <td>
                          {dailyExpenses.map(expense => (
                            <div key={expense.id}>{expense.description}</div>
                          ))}
                        </td>
                        <td>
                          {dailyExpenses.map(expense => (
                            <div key={expense.id}>{expense.type}</div>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className={styles.totalRow}>
                    <td>Total</td>
                    <td>{formatCurrency(totalExpense)}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
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
            <select
              value={newExpense.category}
              onChange={handleCategoryChange}
              className={styles.input}
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              value={newExpense.type}
              onChange={(e) => setNewExpense({ ...newExpense, type: e.target.value })}
              className={styles.input}
              disabled={newExpense.category === 'Relação passada'}
            >
              <option value="Total">Dividir para todos</option>
              <option value="Individual">Gasto individual</option>
              <option value="Selecionados">Dividir com</option>
            </select>
            {newExpense.type === 'Selecionados' && (
              <div className={styles.userCheckboxes}>
                {usersWithExpenses.map(userWithExpense => (
                  <div key={userWithExpense}>
                    <label>
                      <input
                        type="checkbox"
                        checked={newExpense.selectedUsers.includes(userWithExpense)}
                        onChange={() => handleCheckboxChange(userWithExpense)}
                        disabled={userWithExpense === user.email.split('@')[0] || (newExpense.category === 'Relação passada' && newExpense.selectedUsers.length >= 1 && !newExpense.selectedUsers.includes(userWithExpense))}
                      />
                      {userWithExpense}
                    </label>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Descrição (opcional)"
              className={styles.input}
            />
            <button onClick={addExpenseToDB} className={styles.button}>Adicionar</button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ControleDeGastos;
