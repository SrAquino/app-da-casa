import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getItems, addItem as addItemToDB, deleteItem as deleteItemFromDB, savePurchase, saveTotalPurchase, getPastPurchases, saveOpenList, getOpenLists, deleteOpenList } from '../../firebaseConfig'; // Import saveOpenList, getOpenLists, deleteOpenList
import styles from '@/styles/lista-de-compras.module.scss';

const ListaDeCompras = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Horti');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseList, setPurchaseList] = useState([]);
  const [lastPurchaseTotal, setLastPurchaseTotal] = useState(null);
  const [useTodayDate, setUseTodayDate] = useState(true);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({}); // New state for category totals
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedPurchaseCategories, setExpandedPurchaseCategories] = useState({});
  const [pastPurchases, setPastPurchases] = useState([]);
  const [openLists, setOpenLists] = useState([]); // New state for open lists

  const categories = ['Horti', 'Base', 'Higiene', 'Bebida', 'Tempero', 'Extra', 'Carne'];

  useEffect(() => {
    // Fetch items from Firestore
    getItems()
      .then(fetchedItems => {
        const sortedItems = fetchedItems.sort((a, b) => a.name.localeCompare(b.name));
        setItems(sortedItems);
      })
      .catch(error => {
        console.error('There was an error fetching the items!', error);
      });

    // Fetch past purchases from Firestore
    getPastPurchases()
      .then(fetchedPurchases => {
        setPastPurchases(fetchedPurchases.slice(-7)); // Show only the last 7 purchases
      })
      .catch(error => {
        console.error('There was an error fetching the past purchases!', error);
      });

    // Fetch open lists from Firestore
    getOpenLists()
      .then(fetchedOpenLists => {
        setOpenLists(fetchedOpenLists);
      })
      .catch(error => {
        console.error('There was an error fetching the open lists!', error);
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
        const updatedItems = [...items, addedItem].sort((a, b) => a.name.localeCompare(b.name));
        setItems(updatedItems);
        setNewItem('');
        if (isPurchasing) {
          const updatedPurchaseList = [...purchaseList, { ...addedItem, size: '', quantity: '', price: '', date: purchaseDate }]
            .sort((a, b) => a.name.localeCompare(b.name));
          setPurchaseList(updatedPurchaseList);
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
      size: '',
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
    const totals = purchaseList.reduce((acc, item) => {
      if (item.active) {
        const itemTotal = parseFloat(item.quantity) * parseFloat(item.price);
        acc[item.category] = (acc[item.category] || 0) + itemTotal;
      }
      return acc;
    }, {});

    setCategoryTotals(totals);

    const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
    setCurrentTotal(total);
  };

  const finalizePurchase = () => {
    // Validate that all active items have size, quantity, and price filled
    for (const item of purchaseList) {
      if (item.active && (!item.size || !item.quantity || !item.price)) {
        alert('Por favor, preencha todos os campos de tamanho, quantidade e preço para os itens ativos.');
        return;
      }
    }

    const activeItems = purchaseList.filter(item => item.active);

    const totalValue = activeItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) * parseFloat(item.price));
    }, 0);

    const categoryValues = categories.reduce((acc, category) => {
      acc[category] = activeItems
        .filter(item => item.category === category)
        .reduce((sum, item) => sum + (parseFloat(item.quantity) * parseFloat(item.price)), 0);
      return acc;
    }, {});

    const purchaseData = {
      items: activeItems.map(item => ({
        ...item,
        price: (parseFloat(item.price) / parseFloat(item.size)).toFixed(2) // Save price per unit size
      })),
      date: purchaseDate, // Use purchase date
      categoryValues // Save category values
    };

    savePurchase(purchaseData)
      .then(() => {
        setIsPurchasing(false);
        setPurchaseList([]);
        setLastPurchaseTotal(totalValue); // Set the total value of the last purchase
        saveTotalPurchase({ totalValue, date: purchaseData.date, categoryValues }); // Save total purchase value in a different collection
      })
      .catch(error => {
        console.error('There was an error saving the purchase!', error);
      });
  };

  const saveCurrentList = () => {
    const listData = {
      items: purchaseList,
      date: purchaseDate
    };

    saveOpenList(listData)
      .then(() => {
        setOpenLists([...openLists, listData]);
        alert('Lista salva com sucesso!');
      })
      .catch(error => {
        console.error('There was an error saving the list!', error);
      });
  };

  const editOpenList = (list) => {
    setPurchaseList(list.items);
    setPurchaseDate(list.date);
    setIsPurchasing(true);
  };

  const deleteOpenListCard = (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta lista?')) {
      deleteOpenList(id)
        .then(() => {
          setOpenLists(openLists.filter(list => list.id !== id));
        })
        .catch(error => {
          console.error('There was an error deleting the list!', error);
        });
    }
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
    acc[category] = items.filter(item => item.category === category).sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {});

  const categorizedPurchaseList = categories.reduce((acc, category) => {
    acc[category] = purchaseList.filter(item => item.category === category).sort((a, b) => a.name.localeCompare(b.name));
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
                        placeholder="Tamanho"
                        value={item.size}
                        onChange={(e) => handlePurchaseChange(item.id, 'size', e.target.value)}
                        className={`${styles.input} ${styles.sizeInput}`}
                        disabled={!item.active}
                      />
                      <input
                        type="number"
                        placeholder="Qtd"
                        value={item.quantity}
                        onChange={(e) => handlePurchaseChange(item.id, 'quantity', e.target.value)}
                        className={`${styles.input} ${styles.quantityInput}`}
                        disabled={!item.active}
                      />
                      <input
                        type="number"
                        placeholder="Preço"
                        value={item.price}
                        onChange={(e) => handlePurchaseChange(item.id, 'price', e.target.value)}
                        className={`${styles.input} ${styles.priceInput}`}
                        disabled={!item.active}
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
                {Object.entries(categoryTotals).map(([category, total]) => (
                  <p key={category}>{category}: R${total.toFixed(2)}</p>
                ))}
              </div>
            )}
            <button onClick={finalizePurchase} className={styles.button}>Finalizar Compra</button>
            <button onClick={saveCurrentList} className={styles.button}>Salvar Lista Atual</button>
          </div>
        )}
        {lastPurchaseTotal !== null && (
          <div className={styles.lastPurchaseTotal}>
            <h2>Valor Total da Última Compra: R${lastPurchaseTotal.toFixed(2)}</h2>
          </div>
        )}
        <div className={styles.pastPurchasesContainer}>
          <h2>Compras Realizadas</h2>
          {pastPurchases.map(purchase => (
            <div key={purchase.id} className={styles.purchaseCard}>
              <h3>Data: {new Date(purchase.date).toLocaleDateString()}</h3>
              {purchase.categoryValues && Object.entries(purchase.categoryValues).map(([category, total]) => (
                <p key={category}>
                  <span>{category}</span>
                  <span>R${total.toFixed(2)}</span>
                </p>
              ))}
              <p className={styles.total}>
                <span>Valor total</span>
                <span>R${purchase.totalValue.toFixed(2)}</span>
              </p>
            </div>
          ))}
        </div>
        <div className={styles.openListsContainer}>
          <h2>Listas em Aberto</h2>
          {openLists.map(list => (
            <div key={list.id} className={styles.openListCard}>
              <h3>Data: {new Date(list.date).toLocaleDateString()}</h3>
              <button onClick={() => editOpenList(list)} className={styles.button}>Editar</button>
              <button onClick={() => deleteOpenListCard(list.id)} className={styles.deleteButton}>Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListaDeCompras;
