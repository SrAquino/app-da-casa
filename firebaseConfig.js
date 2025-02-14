import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
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

const getExpenses = async () => {
  const querySnapshot = await getDocs(collection(db, "expenses"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const addExpense = async (expense) => {
  const docRef = await addDoc(collection(db, "expenses"), expense);
  return { id: docRef.id, ...expense };
};

const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (err) {
    throw new Error("E-mail ou senha incorretos.");
  }
};

export { db, auth, collection, addDoc, getDocs, getUsers, getExpenses, addExpense, getItems, addItem, signIn };
