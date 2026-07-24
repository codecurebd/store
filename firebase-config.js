// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
  // ✅ Offline persistence এর জন্য
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB15-BRCf0ejIYCDb4Wx-N70gXGx9-R29I",
  authDomain: "simple-store-4175f.firebaseapp.com",
  projectId: "simple-store-4175f",
  storageBucket: "simple-store-4175f.firebasestorage.app",
  messagingSenderId: "708569270600",
  appId: "1:708569270600:web:c5e647d52de75fdf194b7d",
};

const app = initializeApp(firebaseConfig);

// ✅ Firestore with Offline Persistence – performance boost
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// ✅ সব export গুলো এক জায়গায়
export {
  auth, db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  googleProvider,
  githubProvider,
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, addDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, arrayUnion, arrayRemove, increment,
  initializeFirestore, persistentLocalCache, persistentSingleTabManager,
};