import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getItems, getPurchases } from '../../firebaseConfig';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import styles from '@/styles/analise-mercado.module.scss';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AnaliseMercado = () => {
  const [items, setItems] = useState([]);
  const [itemPrices, setItemPrices] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({}); // New state for expanded categories

  const categories = ['Horti', 'Base', 'Higiene', 'Bebida', 'Tempero', 'Extra', 'Carne'];

  useEffect(() => {
    // Fetch items from Firestore
    getItems()
      .then(fetchedItems => {
        setItems(fetchedItems);
        fetchItemPrices(fetchedItems);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const fetchItemPrices = async (items) => {
    const purchases = await getPurchases();
    const prices = {};

    items.forEach(item => {
      prices[item.name] = [];
    });

    purchases.forEach(purchase => {
      purchase.items.forEach(purchaseItem => {
        if (prices[purchaseItem.name]) {
          prices[purchaseItem.name].push({
            date: purchaseItem.date,
            price: parseFloat(purchaseItem.price)
          });
        }
      });
    });

    setItemPrices(prices);
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const categorizedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Análise de Mercado</h1>
        {categories.map(category => (
          <div key={category}>
            <h2 className={styles.categoryTitle}>
              {category}
              <button onClick={() => toggleCategory(category)} className={styles.expandButton}>
                {expandedCategories[category] ? 'Minimizar' : 'Expandir'}
              </button>
            </h2>
            <div className={`${styles.chartContainer} ${!expandedCategories[category] ? styles.hiddenChart : ''}`}>
              {categorizedItems[category].map(item => (
                <div key={item.id} className={`${styles.chartContainer} ${styles[category.toLowerCase()]}`}>
                  <h3>{item.name}</h3>
                  <Line
                    data={{
                      labels: itemPrices[item.name]?.map(price => price.date) || [],
                      datasets: [
                        {
                          label: `Preço de ${item.name} ao longo do tempo`,
                          data: itemPrices[item.name]?.map(price => price.price) || [],
                          borderColor: 'rgba(75, 192, 192, 1)',
                          backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                        title: {
                          display: true,
                          text: `Preço de ${item.name} ao longo do tempo`,
                        },
                      },
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnaliseMercado;