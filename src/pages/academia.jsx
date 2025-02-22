import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getExercises, addExercise, updateExerciseStatus, saveWorkout, getWorkoutData, db } from '../../firebaseConfig';
import { deleteDoc, doc } from "firebase/firestore";
import { useAuth } from '../context/AuthProvider';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import styles from '@/styles/academia.module.scss';

const Academia = () => {
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: '', category: 'Superior' });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [workoutList, setWorkoutList] = useState([]);
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date().toISOString().split('T')[0]);
  const { user } = useAuth();

  const categories = ['Superior', 'Inferior', 'Abdomem'];

  useEffect(() => {
    // Fetch exercises from Firestore
    getExercises()
      .then(fetchedExercises => setExercises(fetchedExercises))
      .catch(error => console.error('Error fetching exercises:', error));
  }, []);

  useEffect(() => {
    const savedWorkoutList = sessionStorage.getItem('workoutList');
    const savedWorkoutDate = sessionStorage.getItem('workoutDate');
    if (savedWorkoutList) {
      setWorkoutList(JSON.parse(savedWorkoutList));
    }
    if (savedWorkoutDate) {
      setWorkoutDate(savedWorkoutDate);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('workoutList', JSON.stringify(workoutList));
    sessionStorage.setItem('workoutDate', workoutDate);
  }, [workoutList, workoutDate]);

  const addNewExercise = () => {
    if (newExercise.name.trim() === '') return;

    addExercise(newExercise)
      .then(addedExercise => {
        setExercises([...exercises, addedExercise]);
        setNewExercise({ name: '', category: 'Superior' });
      })
      .catch(error => console.error('Error adding exercise:', error));
  };

  const toggleCategory = (category) => {
    setExpandedCategories(prevState => ({
      ...prevState,
      [category]: !prevState[category]
    }));
  };

  const toggleExerciseStatus = (exerciseId) => {
    updateExerciseStatus(exerciseId, user.email)
      .then(updatedExercise => {
        setExercises(exercises.map(ex => ex.id === exerciseId ? updatedExercise : ex));
      })
      .catch(error => console.error('Error updating exercise status:', error));
  };

  const removeExercise = (exerciseId) => {
    deleteDoc(doc(db, "exercises", exerciseId))
      .then(() => {
        setExercises(exercises.filter(ex => ex.id !== exerciseId));
      })
      .catch(error => console.error('Error deleting exercise:', error));
  };

  const startWorkout = () => {
    const activeExercises = exercises.filter(ex => ex.activeUsers.includes(user.email));
    const sortedExercises = activeExercises.sort((a, b) => a.name.localeCompare(b.name));
    setWorkoutList(sortedExercises.map(ex => ({ ...ex, series: 0, reps: [], weights: [] })));
  };

  const handleWorkoutChange = (id, field, value) => {
    setWorkoutList(workoutList.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const finalizeWorkout = () => {
    const workoutData = workoutList.map(ex => ({
      ...ex,
      date: workoutDate
    }));

    saveWorkout(workoutData)
      .then(() => {
        setWorkoutList([]);
        sessionStorage.removeItem('workoutList');
        sessionStorage.removeItem('workoutDate');
        alert('Treino finalizado com sucesso!');
      })
      .catch(error => console.error('Error saving workout:', error));
  };

  const cancelWorkout = () => {
    if (window.confirm('Tem certeza de que deseja cancelar o treino?')) {
      setWorkoutList([]);
      sessionStorage.removeItem('workoutList');
      sessionStorage.removeItem('workoutDate');
    }
  };

  const fetchWorkoutData = (exerciseId) => {
    getWorkoutData(exerciseId)
      .then(data => setWorkoutData(data))
      .catch(error => console.error('Error fetching workout data:', error));
  };

  useEffect(() => {
    if (selectedExercise) {
      fetchWorkoutData(selectedExercise);
    }
  }, [selectedExercise]);

  const calculatePerformance = (reps, weights) => {
    return reps.reduce((sum, rep, index) => sum + (rep * weights[index]), 0);
  };

  const chartData = {
    labels: workoutData.map(data => data.date),
    datasets: [
      {
        label: 'Desempenho',
        data: workoutData.map(data => calculatePerformance(data.reps, data.weights)),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.content}>
        <h1>Academia</h1>
        <div className={styles.exerciseSection}>
          <h2>Exercícios Cadastrados</h2>
          {categories.map(category => (
            <div key={category}>
              <h3>
                {category}
                <button onClick={() => toggleCategory(category)} className={styles.expandButton}>
                  {expandedCategories[category] ? 'Esconder' : 'Exibir'}
                </button>
              </h3>
              <ul className={`${styles.list} ${!expandedCategories[category] ? styles.hiddenList : ''}`}>
                {exercises.filter(ex => ex.category === category).map(ex => (
                  <li key={ex.id} className={!ex.activeUsers.includes(user.email) ? styles.inactiveExercise : ''}>
                    {ex.name}
                    <div>
                      <button onClick={() => toggleExerciseStatus(ex.id)} className={styles.statusButton}>
                        {ex.activeUsers.includes(user.email) ? 'Inativar' : 'Ativar'}
                      </button>
                      <button onClick={() => removeExercise(ex.id)} className={styles.deleteButton}>
                        Excluir
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className={styles.addExercise}>
            <input
              type="text"
              value={newExercise.name}
              onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
              placeholder="Adicionar novo exercício"
            />
            <select
              value={newExercise.category}
              onChange={(e) => setNewExercise({ ...newExercise, category: e.target.value })}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button onClick={addNewExercise}>Adicionar</button>
          </div>
        </div>
        <div className={styles.workoutSection}>
          <h2>Fazer Treino</h2>
          <label>
            Data do Treino:
            <input
              type="date"
              value={workoutDate}
              onChange={(e) => setWorkoutDate(e.target.value)}
            />
          </label>
          <button onClick={startWorkout}>Iniciar Treino</button>
          {workoutList.length > 0 && (
            <div>
              {categories.map(category => (
                <div key={category}>
                  <h3>{category}</h3>
                  {workoutList.filter(ex => ex.category === category).map(ex => (
                    <div key={ex.id}>
                      <h3>{ex.name}</h3>
                      <label>
                        Séries:
                        <input
                          type="number"
                          value={ex.series}
                          onChange={(e) => handleWorkoutChange(ex.id, 'series', e.target.value)}
                        />
                      </label>
                      {[...Array(Number(ex.series))].map((_, i) => (
                        <div key={i}>
                          <label>
                            Reps:
                            <input
                              type="number"
                              value={ex.reps[i] || ''}
                              onChange={(e) => {
                                const newReps = [...ex.reps];
                                newReps[i] = e.target.value;
                                handleWorkoutChange(ex.id, 'reps', newReps);
                              }}
                            />
                          </label>
                          <label>
                            Peso:
                            <input
                              type="number"
                              value={ex.weights[i] || ''}
                              onChange={(e) => {
                                const newWeights = [...ex.weights];
                                newWeights[i] = e.target.value;
                                handleWorkoutChange(ex.id, 'weights', newWeights);
                              }}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
              <button onClick={finalizeWorkout}>Finalizar Treino</button>
              <button onClick={cancelWorkout} className={styles.cancelButton}>Cancelar Treino</button>
            </div>
          )}
        </div>
        <div className={styles.performanceSection}>
          <h2>Conferir Desempenho</h2>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            <option value="">Selecione um exercício</option>
            {exercises.sort((a, b) => a.name.localeCompare(b.name)).map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>
          {workoutData.length > 0 && (
            <div className={styles.chartContainer}>
              <Line data={chartData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Academia;
