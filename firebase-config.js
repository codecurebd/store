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
  reauthenticateWithPopup,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  updateEmail,
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

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
  }),
});

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
googleProvider.addScope('profile');
googleProvider.addScope('email');
const githubProvider = new GithubAuthProvider(); // kept for compatibility; UI no longer uses GitHub

// ========== নতুন ফাংশন (অ্যাডমিন প্যানেলের জন্য) ==========

// ✅ অ্যাডমিন প্যানেল থেকে ইউজার তৈরি (Authentication + Firestore)
export async function adminCreateUser(email, password, displayName, role, adminEmail, adminPassword) {
  try {
    // অ্যাডমিনকে সাইন ইন করি (বর্তমান ইউজার যাই হোক)
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    // ইউজার তৈরি
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCred.user;
    await setDoc(doc(db, 'users', user.uid), {
      email,
      displayName: displayName || email.split('@')[0],
      role: role || 'user',
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false,
    });
    await sendEmailVerification(user);
    // আবার অ্যাডমিনকে সাইন ইন করি
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    return { success: true, uid: user.uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ অ্যাডমিন প্যানেল থেকে ইউজার ডিলিট (শুধু Firestore ডকুমেন্ট ডিলিট, Authentication থাকে)
export async function adminDeleteUser(uid, adminEmail, adminPassword) {
  try {
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
    await deleteDoc(doc(db, 'users', uid));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ✅ Google Sign-In helper (creates Firestore user doc if new)
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email: user.email || '',
      displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: !!user.emailVerified,
    });
  }
  return user;
}

// ========== সব export ==========
export {
  auth, db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  GithubAuthProvider,
  googleProvider,
  githubProvider,
  updateEmail,
  collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, addDoc,
  query, where, orderBy, onSnapshot, serverTimestamp, arrayUnion, arrayRemove, increment,
  initializeFirestore, persistentLocalCache, persistentSingleTabManager,
};