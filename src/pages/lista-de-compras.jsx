import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getItems, addItem as addItemToDB, deleteItem as deleteItemFromDB, savePurchase, saveTotalPurchase } from '../../firebaseConfig';
import styles from '@/styles/lista-de-compras.module.scss';

const ListaDeCompras = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Horti');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);
  const [lastPurchaseTotal, setLastPurchaseTotal] = useState(null); // New state for last purchase total
  const [useTodayDate, setUseTodayDate] = useState(true); // New state for using today's date
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]); // New state for purchase date
  const [currentTotal, setCurrentTotal] = useState(0); // New state for current total value
  const [expandedCategories, setExpandedCategories] = useState({}); // New state for expanded categories
  const [expandedPurchaseCategories, setExpandedPurchaseCategories] = useState({}); // New state for expanded purchase categories

  const categories = ['Horti', 'Base', 'Higiene', 'Bebida', 'Tempero', 'Extra', 'Carne'];

  useEffect(() => {
    // Fetch items from Firestore
    getItems()
      .then(fetchedItems => {
        setItems(fetchedItems);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const addItem = () => {
    if (newItem.trim() === '') return;

    // Check for duplicate items
    const duplicateItem = items.find(item => item.name.toLowerCase() === newItem.toLowerCase() && item.category === category);
    if (duplicateItem) {
      alert('Este item já foi adicionado.');
      return;
    }

    // Save new item to Firestore
    addItemToDB({ name: newItem, category })
      .then(addedItem => {
        setItems([...items, addedItem]);
        setNewItem('');
        if (isPurchasing) {
          setPurchaseList([...purchaseList, { ...addedItem, quantity: '', price: '', date: purchaseDate }]);
        }
      })
      .catch(error => {
        console.error('There was an error adding the item!', error);
      });
  };

  const deleteItem = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      // Delete item from Firestore
      deleteItemFromDB(id)
        .then(() => {
          setItems(items.filter(item => item.id !== id));
        })
        .catch(error => {
          console.error('There was an error deleting the item!', error);
        });
    }
  };

  const startPurchase = () => {
    const initialPurchaseList = items.map(item => ({
      ...item,
      quantity: '',
      price: '',
      date: purchaseDate, // Use purchase date
      active: false // Set default active state to false
    }));
    setPurchaseList(initialPurchaseList);
    setIsPurchasing(true);
  };

  const handlePurchaseChange = (id, field, value) => {
    setPurchaseList(purchaseList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleActiveChange = (id) => {
    setPurchaseList(purchaseList.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const removePurchaseItem = (id) => {
    setPurchaseList(purchaseList.filter(item => item.id !== id));
  };

  const checkCurrentTotal = () => {
    const total = purchaseList.reduce((sum, item) => {
      if (item.active) {
        return sum + (parseFloat(item.quantity) * parseFloat(item.price));
      }
      return sum;
    }, 0);
    setCurrentTotal(total);
  };

  const finalizePurchase = () => {
    // Validate that all active items have quantity and price filled
    for (const item of purchaseList) {
      if (item.active && (!item.quantity || !item.price)) {
        alert('Por favor, preencha todos os campos de quantidade e preço para os itens ativos.');
        return;
      }
    }

    const activeItems = purchaseList.filter(item => item.active);

    const totalValue = activeItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.price));
    }, 0);

    const purchaseData = {
      items: activeItems,
      date: purchaseDate // Use purchase date
    };

    savePurchase(purchaseData)
      .then(() => {
        setIsPurchasing(false);
        setPurchaseList([]);
        setLastPurchaseTotal(totalValue); // Set the total value of the last purchase
        saveTotalPurchase({ totalValue, date: purchaseData.date }); // Save total purchase value in a different collection
      })
      .catch(error => {
        console.error('There was an error saving the purchase!', error);
      });
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const togglePurchaseCategory = (category) => {
    setExpandedPurchaseCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const categorizedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {});

  const categorizedPurchaseList = categories.reduce((acc, category) => {
    acc[category] = purchaseList.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Lista de Compras</h1>
        {categories.map(category => (
          <div key={category}>
            <h2 className={styles.categoryTitle}>
              {category}
              <button onClick={() => toggleCategory(category)} className={styles.expandButton}>
                {expandedCategories[category] ? 'Minimizar' : 'Expandir'}
              </button>
            </h2>
            <ul className={`${styles.list} ${!expandedCategories[category] ? styles.hiddenList : ''}`}>
              {categorizedItems[category].map(item => (
                <li key={item.id} className={`${styles.listItem} ${styles[category.toLowerCase()]}`}>
                  {item.name}
                  <button onClick={() => deleteItem(item.id)} className={styles.deleteButton}>Excluir</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Adicionar novo item"
          className={styles.input}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.select}>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        <button onClick={addItem} className={styles.button}>Adicionar</button>
        <button onClick={startPurchase} className={styles.button}>Fazer Nova Compra</button>
        {isPurchasing && (
          <div className={styles.purchaseContainer}>
            <h2>Nova Compra</h2>
            <label className={styles.label}>
              <input
                type="checkbox"
                checked={useTodayDate}
                onChange={() => setUseTodayDate(!useTodayDate)}
                className={styles.checkbox}
              />
              Usar data de hoje
            </label>
            {!useTodayDate && (
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className={styles.input}
              />
            )}
            {categories.map(category => (
              <div key={category}>
                <h2 className={styles.categoryTitle}>
                  {category}
                  <button onClick={() => togglePurchaseCategory(category)} className={styles.expandButton}>
                    {expandedPurchaseCategories[category] ? 'Minimizar' : 'Expandir'}
                  </button>
                </h2>
                <ul className={`${styles.purchaseList} ${!expandedPurchaseCategories[category] ? styles.hiddenList : ''}`}>
                  {categorizedPurchaseList[category].map(item => (
                    <li key={item.id} className={`${styles.purchaseItem} ${styles[category.toLowerCase()]}`}>
                      <span>{item.name}</span>
                      <input
                        type="number"
                        placeholder="Qtd"
                        value={item.quantity}
                        onChange={(e) => handlePurchaseChange(item.id, 'quantity', e.target.value)}
                        className={`${styles.input} ${styles.quantityInput}`}
                        disabled={!item.active} // Disable input if item is inactive
                      />
                      <input
                        type="number"
                        placeholder="Preço"
                        value={item.price}
                        onChange={(e) => handlePurchaseChange(item.id, 'price', e.target.value)}
                        className={`${styles.input} ${styles.priceInput}`}
                        disabled={!item.active} // Disable input if item is inactive
                      />
                      <label className={styles.label}>
                        <input
                          type="checkbox"
                          checked={item.active}
                          onChange={() => handleActiveChange(item.id)}
                          className={styles.checkbox}
                        />
                        Ativo
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={checkCurrentTotal} className={styles.button}>Conferir Valor Atual</button>
            {currentTotal > 0 && (
              <div className={styles.currentTotal}>
                <h2>Valor Atual: R${currentTotal.toFixed(2)}</h2>
              </div>
            )}
            <button onClick={finalizePurchase} className={styles.button}>Finalizar Compra</button>
          </div>
        )}
        {lastPurchaseTotal !== null && (
          <div className={styles.lastPurchaseTotal}>
            <h2>Valor Total da Última Compra: R${lastPurchaseTotal.toFixed(2)}</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListaDeCompras;
