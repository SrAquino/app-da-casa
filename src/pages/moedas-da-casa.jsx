"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ProtectedRoute from '../components/ProtectedRoute'; // Import ProtectedRoute
import { getCoins, addCoin, deleteCoin } from '../../firebaseConfig';
import { useAuth } from '../context/AuthProvider';
import styles from '@/styles/moedas-da-casa.module.scss';

const MoedasDaCasa = () => {
  const [coins, setCoins] = useState([]);
  const [newCoin, setNewCoin] = useState({ date: new Date().toISOString().split('T')[0], type: '', value: '' });
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { user } = useAuth();

  const coinTypes = ['🏋🏻', '🎟', '🎨', '🍷', '💰', '🥇', '❤‍', '🌀', '📌'];

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split('-');
      const collectionName = `coins_${month}${year}`;

      getCoins(collectionName)
        .then(fetchedCoins => setCoins(fetchedCoins))
        .catch(error => console.error('Error fetching coins:', error));
    }
  }, [selectedMonth]);

  const addCoinToDB = (type, value) => {
    if (!newCoin.date || !type || !value) return;

    const username = user.email.split('@')[0];
    const [year, month] = newCoin.date.split('-');
    const coin = { date: newCoin.date, type, value, user: username };

    addCoin(coin, `coins_${month}${year}`)
      .then(addedCoin => {
        setCoins([...coins, addedCoin]);
        setCoinInputs(coinTypes.reduce((acc, type) => {
          acc[type] = { add: '', spend: '' };
          return acc;
        }, {}));
      })
      .catch(error => console.error('Error adding coin:', error));
  };

  const spendCoinFromDB = (type, value) => {
    const username = user.email.split('@')[0];
    const [year, month] = newCoin.date.split('-');
    const coin = { date: newCoin.date, type, value: -value, user: username };

    if (coinTotals[type] - value < 0) {
      alert(`Não é possível gastar mais moedas do que o total disponível para ${type}.`);
      return;
    }

    addCoin(coin, `coins_${month}${year}`)
      .then(addedCoin => {
        setCoins([...coins, addedCoin]);
        setCoinInputs(coinTypes.reduce((acc, type) => {
          acc[type] = { add: '', spend: '' };
          return acc;
        }, {}));
      })
      .catch(error => console.error('Error spending coin:', error));
  };

  const deleteCoinFromDB = (id, collectionName) => {
    deleteCoin(id)
      .then(() => {
        setCoins(coins.filter(coin => coin.id !== id));
      })
      .catch(error => console.error('Error deleting coin:', error));
  };

  const getDaysInMonth = (month) => {
    const [year, monthIndex] = month.split('-');
    return new Date(year, monthIndex, 0).getDate();
  };

  const daysInMonth = selectedMonth ? getDaysInMonth(selectedMonth) : 0;

  const userCoins = coins.filter(coin => coin.user === selectedUser);
  const usersWithCoins = [...new Set(coins.map(coin => coin.user))];

  const coinTotals = coinTypes.reduce((acc, type) => {
    acc[type] = userCoins
      .filter(coin => coin.type === type)
      .reduce((sum, coin) => sum + parseFloat(coin.value), 0);
    return acc;
  }, {});

  const [coinInputs, setCoinInputs] = useState(
    coinTypes.reduce((acc, type) => {
      acc[type] = { add: '', spend: '' };
      return acc;
    }, {})
  );

  const handleInputChange = (type, action, value) => {
    setCoinInputs({
      ...coinInputs,
      [type]: {
        ...coinInputs[type],
        [action]: value,
      },
    });
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <div>
            <h1>Moedas da Casa</h1>
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
              {usersWithCoins.map(user => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>
          {selectedUser && (
            <div className={styles.userTable}>
              <h2>Moedas de {selectedUser}</h2>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Dia</th>
                    {coinTypes.map(type => (
                      <th key={type}>{type}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const date = `${selectedMonth}-${String(i + 1).padStart(2, '0')}`;
                    const dailyCoins = userCoins.filter(coin => coin.date === date);

                    return (
                      <tr key={date} className={i % 2 === 0 ? styles.evenRow : styles.oddRow}>
                        <td>{String(i + 1).padStart(2, '0')}</td>
                        {coinTypes.map(type => (
                          <td key={type}>
                            {dailyCoins
                              .filter(coin => coin.type === type)
                              .map(coin => (
                                <div key={coin.id}>
                                  {coin.value}
                                </div>
                              ))}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr className={styles.totalRow}>
                    <td>Total</td>
                    {coinTypes.map(type => (
                      <td key={type}>{coinTotals[type]}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className={styles.addCoin}>
            <h2>Adicionar/Gastar Moedas</h2>
            <input
              type="date"
              value={newCoin.date}
              onChange={(e) => setNewCoin({ ...newCoin, date: e.target.value })}
              className={styles.input}
            />
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ação</th>
                  {coinTypes.map(type => (
                    <th key={type}>{type}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Adicionar</td>
                  {coinTypes.map(type => (
                    <td key={type}>
                      <input
                        type="number"
                        value={coinInputs[type].add}
                        onChange={(e) => handleInputChange(type, 'add', e.target.value)}
                        className={styles.input}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => {
                        coinTypes.forEach(type => {
                          if (coinInputs[type].add) {
                            addCoinToDB(type, coinInputs[type].add);
                          }
                        });
                      }}
                      className={styles.button}
                    >
                      Adicionar
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Gastar</td>
                  {coinTypes.map(type => (
                    <td key={type}>
                      <input
                        type="number"
                        value={coinInputs[type].spend}
                        onChange={(e) => handleInputChange(type, 'spend', e.target.value)}
                        className={styles.input}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      onClick={() => {
                        coinTypes.forEach(type => {
                          if (coinInputs[type].spend) {
                            spendCoinFromDB(type, coinInputs[type].spend);
                          }
                        });
                      }}
                      className={styles.button}
                    >
                      Gastar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MoedasDaCasa;
