import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaMoneyBillWave, FaChartPie, FaShoppingCart } from 'react-icons/fa';
import styles from './Sidebar.module.scss';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <button onClick={toggleSidebar} className={styles.toggleButton}>
        {isExpanded ? 'Esconder' : <FaBars />}
      </button>
      <h2>Menu</h2>
      <ul>
        <li>
          <Link href="/controle-de-gastos">
            {isExpanded ? 'Controle de Gastos' : <FaMoneyBillWave />}
          </Link>
        </li>
        <li>
          <Link href="/analise-gastos">
            {isExpanded ? 'Gráficos' : <FaChartPie />}
          </Link>
        </li>
        <li>
          <Link href="/lista-de-compras">
            {isExpanded ? 'Lista de Compras' : <FaShoppingCart />}
          </Link>
        </li>
        <li>
          <Link href="/analise-mercado">
            {isExpanded ? 'Preços de mercado' : <FaChartPie />}
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
