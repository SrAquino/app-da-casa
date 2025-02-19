import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getExpenses, getUsers } from '../../firebaseConfig';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from '@/styles/graficos.module.scss';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Graficos = () => {
  const [expenses, setExpenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [userExpenses, setUserExpenses] = useState({});
  const [identifiedUsers, setIdentifiedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [expenseType, setExpenseType] = useState('Total total');
  const [numPeople, setNumPeople] = useState(3);
  const [splitExpenses, setSplitExpenses] = useState(Array(3).fill(''));
  const [transactions, setTransactions] = useState([]);
  const [parallelTransactions, setParallelTransactions] = useState([]);
  const categories = ['Mercado', 'Açougue', 'Padaria', 'Horti', 'Pet', 'Contas', 'Lazer', 'Transporte', 'Outros', 'Relação passada'];

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const collectionName = `${month}${year}`;

      getExpenses(collectionName)
        .then(fetchedExpenses => {
          setExpenses(fetchedExpenses);

          const userTotals = fetchedExpenses.reduce((acc, expense) => {
            if (expense.type === 'Total') {
              acc[expense.user] = (acc[expense.user] || 0) + parseFloat(expense.value);
            }
            return acc;
          }, {});
          setUserExpenses(userTotals);
          setIdentifiedUsers(Object.keys(userTotals));
        })
        .catch(error => console.error('Error fetching expenses:', error));
    }
  }, [selectedMonth]);

  const filterExpense = (expense) => {
    if (expenseType === 'Total total') return true;
    if (expenseType === 'Individual') return expense.user === selectedUser && expense.type === 'Individual';
    if (expenseType === 'Total da casa') return expense.type === 'Total';
    if (expenseType === 'Controle') {
      if (expense.type === 'Individual' && expense.user === selectedUser) return true;
      if (expense.type === 'Total') return true;
      if (expense.type === 'Selecionados' && (expense.selectedUsers.includes(selectedUser) || expense.user === selectedUser)) return true;
    }
    return false;
  };

  const filteredExpenses = expenses.filter(filterExpense);

  const categorizedExpenses = categories.reduce((acc, category) => {
    acc[category] = identifiedUsers.map(user => filteredExpenses
      .filter(expense => {
        if (expenseType === 'Total total') return expense.user === user && expense.category === category;
        if (expenseType === 'Individual') return expense.user === user && expense.category === category;
        if (expenseType === 'Total da casa') return expense.user === user && expense.category === category;
        if (expenseType === 'Controle') {
          if (expense.type === 'Individual' && expense.user === user && expense.category === category) return true;
          if (expense.type === 'Total' && expense.category === category) return true;
          if (expense.type === 'Selecionados' && (expense.selectedUsers.includes(user) || expense.user === user) && expense.category === category) return true;
        }
        return false;
      })
      .reduce((sum, expense) => {
        if (expenseType === 'Controle') {
          if (expense.type === 'Total') {
            return sum + parseFloat(expense.value) / identifiedUsers.length;
          }
          if (expense.type === 'Selecionados') {
            if (expense.category === 'Relação passada') {
              return sum + (expense.selectedUsers.includes(user) ? parseFloat(expense.value) : 0);
            }
            return sum + parseFloat(expense.value) / (expense.selectedUsers.length + 1);
          }
        }
        return sum + parseFloat(expense.value);
      }, 0));
    return acc;
  }, {});

  const totalExpenses = Object.values(categorizedExpenses).flat().reduce((sum, value) => sum + value, 0);

  const userColors = identifiedUsers.reduce((acc, user, index) => {
    const firstLetter = user.charAt(0).toUpperCase();
    acc[user] = `hsl(${(firstLetter.charCodeAt(0) - 65) * 15}, 70%, 50%)`;
    return acc;
  }, {});

  const chartData = {
    labels: categories,
    datasets: identifiedUsers.map((user, userIndex) => ({
      label: user,
      data: categories.map(category => categorizedExpenses[category][userIndex]),
      backgroundColor: userColors[user],
    })),
  };

  const pieChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Gastos por Categoria (%)',
        data: categories.map(category => categorizedExpenses[category].reduce((sum, value) => sum + value, 0) / totalExpenses * 100),
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

  const getUserExpensesForControl = () => {
    return categories.reduce((acc, category) => {
      acc[category] = filteredExpenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => {
          if (expense.type === 'Total') {
            return sum + parseFloat(expense.value) / identifiedUsers.length;
          }
          if (expense.type === 'Selecionados') {
            if (expense.category === 'Relação passada') {
              return sum + (expense.selectedUsers.includes(selectedUser) ? parseFloat(expense.value) : 0);
            }
            return sum + parseFloat(expense.value) / (expense.selectedUsers.length + 1);
          }
          if (expense.type === 'Individual' && expense.user === selectedUser) {
            return sum + parseFloat(expense.value);
          }
          return sum;
        }, 0);
      return acc;
    }, {});
  };

  const userExpensesForControl = getUserExpensesForControl();

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

  const calculateParallelPayments = () => {
    const parallelExpenses = expenses.filter(expense => expense.type === 'Selecionados');
    const payments = {};

    parallelExpenses.forEach(expense => {
      const totalUsers = expense.selectedUsers.length + 1;
      const amountPerUser = parseFloat(expense.value) / totalUsers;

      expense.selectedUsers.forEach(debtor => {
        if (!payments[debtor]) payments[debtor] = {};
        if (!payments[debtor][expense.user]) payments[debtor][expense.user] = 0;
        payments[debtor][expense.user] += amountPerUser;
      });
    });

    const result = [];
    Object.keys(payments).forEach(debtor => {
      Object.keys(payments[debtor]).forEach(payer => {
        if (payments[payer] && payments[payer][debtor]) {
          const netAmount = payments[debtor][payer] - payments[payer][debtor];
          if (netAmount > 0) {
            result.push({ from: debtor, to: payer, amount: netAmount.toFixed(2) });
          } else if (netAmount < 0) {
            result.push({ from: payer, to: debtor, amount: (-netAmount).toFixed(2) });
          }
          delete payments[payer][debtor];
        } else {
          result.push({ from: debtor, to: payer, amount: payments[debtor][payer].toFixed(2) });
        }
      });
    });

    setParallelTransactions(result);
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
          <label htmlFor="expenseType" className={styles.label}>Tipo de Gasto:</label>
          <select
            id="expenseType"
            value={expenseType}
            onChange={(e) => setExpenseType(e.target.value)}
            className={styles.input}
          >
            <option value="Total total">Total total</option>
            <option value="Individual">Individual</option>
            <option value="Total da casa">Total da casa</option>
            <option value="Controle">Controle</option>
          </select>
          {(expenseType === 'Individual' || expenseType === 'Controle') && (
            <div>
              <label htmlFor="user" className={styles.label}>Selecione o usuário:</label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className={styles.input}
              >
                <option value="">Selecione um usuário</option>
                {identifiedUsers.map(user => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              {expenseType === 'Individual' && (
                <p className={styles.description}>Esta opção exibe os gastos individuais feitos pelo usuário selecionado</p>
              )}
              {expenseType === 'Controle' && (
                <p className={styles.description}>Esta opção exibe os gastos divididos a serem pagos</p>
              )}
            </div>
          )}
          {expenseType === 'Total total' && (
            <p className={styles.description}>Esta opção exibe todos os gastos feitos por todos os usuários da casa</p>
          )}
          {expenseType === 'Total da casa' && (
            <p className={styles.description}>Esta opção mostra apenas os gastos que serão divididos para todos os membros da casa</p>
          )}
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
                        <td>R${expenseType === 'Controle' ? userExpensesForControl[category].toFixed(2) : categorizedExpenses[category].reduce((sum, value) => sum + value, 0).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>Total</td>
                      <td>R${expenseType === 'Controle' ? Object.values(userExpensesForControl).reduce((sum, value) => sum + value, 0).toFixed(2) : totalExpenses.toFixed(2)}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className={styles.chartContainer}>
            <Bar data={chartData} options={{ scales: { x: { stacked: true }, y: { stacked: true } } }} />
          </div>
          <div className={styles.chartContainer}>
            <Pie data={pieChartData} />
          </div>
        </div>
        <div className={styles.parallelExpenses}>
          <h2>Despesas Paralelas</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Pagador</th>
                <th>Devedor</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {expenses.filter(expense => expense.type === 'Selecionados').map(expense => (
                <tr key={expense.id}>
                  <td>{expense.user}</td>
                  <td>{expense.selectedUsers.join(', ')}</td>
                  <td>
                    <span className={styles.tooltip} data-tooltip={`${expense.category}: ${expense.description || 'Sem comentário'}`}>
                      R${parseFloat(expense.value).toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={calculateParallelPayments} className={styles.button}>
            Calcular Despesas Paralelas
          </button>
          <div className={styles.transactions}>
            {parallelTransactions.length > 0 && <h3 className={styles.subtitle}>Pagamentos necessários:</h3>}
            {parallelTransactions.map((t, idx) => (
              <p key={idx} className={styles.transactionItem}>{t.from} deve pagar R$ {t.amount} para {t.to}</p>
            ))}
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
