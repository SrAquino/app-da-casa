import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getExpenses, getUsers } from '../../firebaseConfig';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '@/styles/graficos.module.scss';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Graficos = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [userExpenses, setUserExpenses] = useState({});
  const [identifiedUsers, setIdentifiedUsers] = useState([]);
  const categories = ['Mercado', 'Açougue', 'Padaria', 'Horti', 'Pet', 'Contas', 'Lazer', 'Transporte', 'Outros'];

  useEffect(() => {
    getUsers()
      .then(fetchedUsers => setUsers(fetchedUsers))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const collectionName = `${month}${year}`;

      // Fetch expenses for the selected month from Firestore
      getExpenses(collectionName)
        .then(fetchedExpenses => {
          setExpenses(fetchedExpenses);

          // Identify users and sum their total expenses
          const userTotals = fetchedExpenses.reduce((acc, expense) => {
            acc[expense.user] = (acc[expense.user] || 0) + parseFloat(expense.value);
            return acc;
          }, {});
          setUserExpenses(userTotals);
          setIdentifiedUsers(Object.keys(userTotals));
        })
        .catch(error => console.error('Error fetching expenses:', error));
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (selectedMonth) {
      const categorizedExpenses = categories.reduce((acc, category) => {
        acc[category] = expenses
          .filter(expense => expense.category === category)
          .reduce((sum, expense) => sum + parseFloat(expense.value), 0);
        return acc;
      }, {});
      setMonthlyExpenses(categorizedExpenses);
    }
  }, [selectedMonth, expenses]);

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Gastos por Categoria',
        data: categories.map(category => monthlyExpenses[category] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const totalExpenses = Object.values(monthlyExpenses).reduce((sum, value) => sum + value, 0);
  const averageExpense = totalExpenses / users.length;

  const usersWithExpenses = users.filter(user => userExpenses[user.email.split('@')[0]]);

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Análise de Gastos</h1>
        <div className={styles.filterContainer}>
          <label htmlFor="month" className={styles.label}>Selecione o mês:</label>
          <input
            type="month"
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={styles.input}
          />
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mês</th>
              {categories.map(category => (
                <th key={category}>{category}</th>
              ))}
              <th>Total</th> {/* Nova coluna para total */}
            </tr>
          </thead>
          <tbody>
            {selectedMonth && (
              <tr>
                <td>{selectedMonth}</td>
                {categories.map(category => (
                  <td key={category}>{monthlyExpenses[category] || 0}</td>
                ))}
                <td>{totalExpenses.toFixed(2)}</td> {/* Exibe o total */}
              </tr>
            )}
          </tbody>
        </table>
        <div className={styles.chartContainer}>
          <Bar data={chartData} />
        </div>
        <div className={styles.userExpenses}>
          <h2>Gastos por Usuário</h2>
          <ul>
            {identifiedUsers.map(user => (
              <li key={user}>
                {user}: R${(userExpenses[user] || 0).toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
