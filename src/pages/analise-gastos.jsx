import React from 'react';
import Sidebar from '../components/Sidebar';
import styles from '@/styles/graficos.module.scss';

const Graficos = () => {
  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Gráficos</h1>
        {/* Conteúdo dos gráficos */}
      </div>
    </div>
  );
};

export default Graficos;
