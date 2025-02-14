import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getItems, addItem as addItemToDB } from '../../firebaseConfig';
import styles from '@/styles/lista-de-compras.module.scss';

const ListaDeCompras = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Horti');

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
                <li key={item.id} className={styles.listItem}>{item.name}</li>
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
      </div>
    </div>
  );
};

export default ListaDeCompras;
