import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, writeBatch, doc, deleteDoc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const getItems = async () => {
  const querySnapshot = await getDocs(collection(db, "items"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addItem = async (item) => {
  const docRef = await addDoc(collection(db, "items"), item);
  return { id: docRef.id, ...item, category: item.category };
};

/*const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
*/

const getExpenses = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addExpense = async (expense, collectionName) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), expense);
    return { id: docRef.id, ...expense };
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

const getCoins = async (collectionName) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addCoin = async (coin, collectionName) => {
  const docRef = await addDoc(collection(db, collectionName), coin);
  return { id: docRef.id, ...coin };
};

const deleteCoin = async (id, collectionName) => {
  await deleteDoc(doc(db, collectionName, id));
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (err) {
    throw new Error("E-mail ou senha incorretos.");
  }
};

const savePurchase = async (purchaseData) => {
  const batch = writeBatch(db);
  const purchaseCollection = collection(db, "purchases");
  const docRef = doc(purchaseCollection); // Create a new document reference
  batch.set(docRef, purchaseData);
  await batch.commit();
};

const saveTotalPurchase = async (totalPurchaseData) => {
  try {
    await addDoc(collection(db, "totalPurchases"), totalPurchaseData);
  } catch (error) {
    console.error('Error saving total purchase:', error);
    throw error;
  }
};

const getPurchases = async () => {
  const querySnapshot = await getDocs(collection(db, "purchases"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getPastPurchases = async () => {
  const querySnapshot = await getDocs(collection(db, "totalPurchases"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteItem = async (id) => {
  try {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

const saveOpenList = async (listData) => {
  try {
    const docRef = await addDoc(collection(db, "openLists"), listData);
    return { id: docRef.id, ...listData };
  } catch (error) {
    console.error('Error saving open list:', error);
    throw error;
  }
};

const getOpenLists = async () => {
  const querySnapshot = await getDocs(collection(db, "openLists"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const deleteOpenList = async (id) => {
  try {
    const listRef = doc(db, "openLists", id);
    await deleteDoc(listRef);
  } catch (error) {
    console.error('Error deleting open list:', error);
    throw error;
  }
};

const getExercises = async () => {
  const querySnapshot = await getDocs(collection(db, "exercises"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addExercise = async (exercise) => {
  const docRef = await addDoc(collection(db, "exercises"), { ...exercise, activeUsers: [] });
  return { id: docRef.id, ...exercise, activeUsers: [] };
};

const updateExerciseStatus = async (exerciseId, userEmail) => {
  const exerciseRef = doc(db, "exercises", exerciseId);
  const exerciseDoc = await getDoc(exerciseRef);
  const exerciseData = exerciseDoc.data();
  const activeUsers = exerciseData.activeUsers.includes(userEmail)
    ? exerciseData.activeUsers.filter(user => user !== userEmail)
    : [...exerciseData.activeUsers, userEmail];
  await updateDoc(exerciseRef, { activeUsers });
  return { id: exerciseId, ...exerciseData, activeUsers };
};

const saveWorkout = async (workoutData) => {
  const batch = writeBatch(db);
  workoutData.forEach(workout => {
    const workoutRef = doc(collection(db, "workouts"));
    batch.set(workoutRef, workout);
  });
  await batch.commit();
};

const getWorkoutData = async (exerciseId) => {
  const querySnapshot = await getDocs(collection(db, "workouts"));
  return querySnapshot.docs
    .map(doc => doc.data())
    .filter(workout => workout.id === exerciseId);
};

export { db, auth, collection, addDoc, getDocs, getExpenses, addExpense, getItems, addItem, signIn, savePurchase, saveTotalPurchase, getPurchases, deleteItem, getCoins, addCoin, deleteCoin, getPastPurchases, saveOpenList, getOpenLists, deleteOpenList, getExercises, addExercise, updateExerciseStatus, saveWorkout, getWorkoutData };
