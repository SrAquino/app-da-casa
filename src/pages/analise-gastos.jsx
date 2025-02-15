import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getExpenses, getUsers } from '../../firebaseConfig';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from '@/styles/graficos.module.scss';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Graficos = () => {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState({});
  const [userExpenses, setUserExpenses] = useState({});
  const [identifiedUsers, setIdentifiedUsers] = useState([]);
  const [numPeople, setNumPeople] = useState(3);
  const [splitExpenses, setSplitExpenses] = useState(Array(3).fill(''));
  const [transactions, setTransactions] = useState([]);
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

  const totalExpenses = Object.values(monthlyExpenses).reduce((sum, value) => sum + value, 0);

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

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Gastos por Categoria (%)',
        data: categories.map(category => ((monthlyExpenses[category] || 0) / totalExpenses) * 100),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#FF9F40',
          '#4BC0C0',
          '#9966FF',
          '#FF6384',
          '#36A2EB',
          '#FFCE56'
        ],
      },
    ],
  };

  const averageExpense = totalExpenses / users.length;

  const usersWithExpenses = users.filter(user => userExpenses[user.email.split('@')[0]]);

  const handleNumPeopleChange = (e) => {
    const num = parseInt(e.target.value, 10) || 1;
    setNumPeople(num);
    setSplitExpenses(Array(num).fill(''));
    setTransactions([]);
  };

  const handleExpenseChange = (index, value) => {
    const newExpenses = [...splitExpenses];
    newExpenses[index] = value;
    setSplitExpenses(newExpenses);
  };

  const calculatePayments = () => {
    const num = splitExpenses.length;
    const expenseValues = splitExpenses.map((e) => parseFloat(e) || 0);
    const totalExpense = expenseValues.reduce((acc, val) => acc + val, 0);
    const perPerson = totalExpense / num;
    
    let balances = expenseValues.map((spent) => spent - perPerson);
    let debtors = [], creditors = [];
    
    balances.forEach((balance, index) => {
      if (balance < 0) debtors.push([index, -balance]);
      if (balance > 0) creditors.push([index, balance]);
    });
    
    let result = [];
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      let [debtor, debt] = debtors[i];
      let [creditor, credit] = creditors[j];
      let amount = Math.min(debt, credit);
      
      result.push({ from: debtor + 1, to: creditor + 1, amount: amount.toFixed(2) });
      
      debtors[i][1] -= amount;
      creditors[j][1] -= amount;
      if (debtors[i][1] === 0) i++;
      if (creditors[j][1] === 0) j++;
    }
    
    setTransactions(result);
  };

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
        <div className={styles.analysisContainer}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {selectedMonth && (
                  <>
                    <tr>
                      <td>Mês</td>
                      <td>{selectedMonth}</td>
                    </tr>
                    {categories.map(category => (
                      <tr key={category}>
                        <td>{category}</td>
                        <td>R${(monthlyExpenses[category] || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total</td>
                      <td>R${totalExpenses.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.chartContainer}>
            <Bar data={chartData} />
          </div>
          <div className={styles.chartContainer}>
            <Pie data={pieChartData} />
          </div>
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
        <div className={styles.expenseSplitter}>
          <h2 className={styles.title}>Divisor de Despesas</h2>
          <label className={styles.label}>Número de moradores:</label>
          <input 
            type="number" 
            value={numPeople} 
            onChange={handleNumPeopleChange} 
            className={styles.input} 
            min="1"
          />
          {splitExpenses.map((value, index) => (
            <div key={index} className={styles.splitExpenseItem}>
              <label>Morador {index + 1}:</label>
              <input 
                type="number" 
                value={value} 
                onChange={(e) => handleExpenseChange(index, e.target.value)} 
                className={styles.input}
              />
            </div>
          ))}
          <button onClick={calculatePayments} className={styles.button}>
            Calcular Pagamentos
          </button>
          <div className={styles.transactions}>
            {transactions.length > 0 && <h3 className={styles.subtitle}>Pagamentos necessários:</h3>}
            {transactions.map((t, idx) => (
              <p key={idx} className={styles.transactionItem}>Morador {t.from} deve pagar R$ {t.amount} para Morador {t.to}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graficos;
