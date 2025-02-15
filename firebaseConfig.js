import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, writeBatch, doc, deleteDoc } from "firebase/firestore";
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

const getUsers = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

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

const deleteItem = async (id) => {
  try {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export { db, auth, collection, addDoc, getDocs, getUsers, getExpenses, addExpense, getItems, addItem, signIn, savePurchase, deleteItem };
