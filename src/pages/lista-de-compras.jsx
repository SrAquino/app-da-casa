import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getItems, addItem as addItemToDB, deleteItem as deleteItemFromDB, savePurchase } from '../../firebaseConfig';
import styles from '@/styles/lista-de-compras.module.scss';

const ListaDeCompras = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Horti');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);
  const [lastPurchaseTotal, setLastPurchaseTotal] = useState(null); // New state for last purchase total

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

    // Save new item to Firestore
    addItemToDB({ name: newItem, category })
      .then(addedItem => {
        setItems([...items, addedItem]);
        setNewItem('');
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
      price: ''
    }));
    setPurchaseList(initialPurchaseList);
    setIsPurchasing(true);
  };

  const handlePurchaseChange = (id, field, value) => {
    setPurchaseList(purchaseList.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removePurchaseItem = (id) => {
    setPurchaseList(purchaseList.filter(item => item.id !== id));
  };

  const finalizePurchase = () => {
    // Validate that all items have quantity and price filled
    for (const item of purchaseList) {
      if (!item.quantity || !item.price) {
        alert('Por favor, preencha todos os campos de quantidade e preço.');
        return;
      }
    }

    const totalValue = purchaseList.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.price));
    }, 0);

    const purchaseData = {
      items: purchaseList,
      totalValue,
      date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    };

    savePurchase(purchaseData)
      .then(() => {
        setIsPurchasing(false);
        setPurchaseList([]);
        setLastPurchaseTotal(totalValue); // Set the total value of the last purchase
      })
      .catch(error => {
        console.error('There was an error saving the purchase!', error);
      });
  };

  const categorizedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1 className={styles.title}>Lista de Compras</h1>
        {categories.map(category => (
          <div key={category}>
            <h2 className={styles.categoryTitle}>{category}</h2>
            <ul className={styles.list}>
              {categorizedItems[category].map(item => (
                <li key={item.id} className={styles.listItem}>
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
            <ul className={styles.purchaseList}>
              {purchaseList.map(item => (
                <li key={item.id} className={styles.purchaseItem}>
                  <span>{item.name}</span>
                  <input
                    type="number"
                    placeholder="Quantidade"
                    value={item.quantity}
                    onChange={(e) => handlePurchaseChange(item.id, 'quantity', e.target.value)}
                    className={styles.input}
                  />
                  <input
                    type="number"
                    placeholder="Preço"
                    value={item.price}
                    onChange={(e) => handlePurchaseChange(item.id, 'price', e.target.value)}
                    className={styles.input}
                  />
                  <button onClick={() => removePurchaseItem(item.id)} className={styles.deleteButton}>Remover</button>
                </li>
              ))}
            </ul>
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
