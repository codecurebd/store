// firebase-config.js
import {
  initializeApp,
  deleteApp,
  getApp,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

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
  deleteField,
  writeBatch,
  runTransaction,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// ═══════════════════════════════════════════════════════════════
// FIREBASE CONFIG
// ═══════════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// AUTH PROVIDERS
// ═══════════════════════════════════════════════════════════════
const googleProvider = new GoogleAuthProvider();
// NOTE: prompt: 'select_account' removed — smoother re-login
googleProvider.addScope('profile');
googleProvider.addScope('email');

const githubProvider = new GithubAuthProvider(); // kept for compatibility

// ═══════════════════════════════════════════════════════════════
// SECONDARY APP HELPER (for admin user creation)
// ───────────────────────────────────────────────────────────────
// Uses a temporary secondary Firebase app so the admin's session
// is NEVER signed out when creating a new user.
// ═══════════════════════════════════════════════════════════════
async function createUserInSecondaryApp(email, password, displayName) {
  const secondaryName = `secondary-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

  let secondaryApp;
  try {
    secondaryApp = initializeApp(firebaseConfig, secondaryName);
  } catch (err) {
    // If name collides (very rare), clean up and retry
    try {
      const existing = getApp(secondaryName);
      await deleteApp(existing);
    } catch (_) {}
    secondaryApp = initializeApp(firebaseConfig, secondaryName);
  }

  const secondaryAuth = getAuth(secondaryApp);

  try {
    const userCred = await createUserWithEmailAndPassword(
      secondaryAuth,
      email,
      password
    );
    const user = userCred.user;
    const uid = user.uid;

    // Send verification email (non-blocking)
    try {
      await sendEmailVerification(user);
    } catch (ve) {
      console.warn('[adminCreateUser] verification email failed:', ve);
    }

    // Sign out of secondary app to release resources
    try {
      await signOut(secondaryAuth);
    } catch (_) {}

    return { success: true, uid };
  } catch (err) {
    console.error('[adminCreateUser] secondary app error:', err);
    return { success: false, error: err.message, code: err.code };
  } finally {
    try {
      await deleteApp(secondaryApp);
    } catch (_) {}
  }
}

// ═══════════════════════════════════════════════════════════════
// ADMIN: CREATE USER
// ───────────────────────────────────────────────────────────────
// Signature kept backward-compatible (extra params ignored).
//
// @param {string} email
// @param {string} password
// @param {string} displayName
// @param {string} role - 'user' | 'admin'
// @returns {Promise<{success: boolean, uid?: string, error?: string}>}
// ═══════════════════════════════════════════════════════════════
export async function adminCreateUser(
  email,
  password,
  displayName,
  role = 'user',
  _adminEmail, // ignored — kept for backward compat
  _adminPassword // ignored — kept for backward compat
) {
  try {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      return { success: false, error: 'You must be signed in as admin.' };
    }

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' };
    }
    if (password.length < 6) {
      return {
        success: false,
        error: 'Password must be at least 6 characters.',
      };
    }

    // Create user in secondary app (admin session untouched)
    const result = await createUserInSecondaryApp(email, password, displayName);
    if (!result.success) {
      return { success: false, error: result.error || 'Failed to create user.' };
    }

    // Write user doc to Firestore (admin has permission via rules)
    await setDoc(doc(db, 'users', result.uid), {
      email,
      displayName: displayName || email.split('@')[0],
      role: role || 'user',
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false,
    });

    return { success: true, uid: result.uid };
  } catch (error) {
    console.error('adminCreateUser error:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// ADMIN: DELETE USER
// ───────────────────────────────────────────────────────────────
// Simplified signature: only `uid` required.
// Admin info is read from `auth.currentUser`.
//
// Flow:
//   1. Archive all orders → archivedOrders
//   2. Archive user profile → deletedUsers
//   3. Delete users/{uid} doc
//   4. Try Cloud Function to delete Auth user (optional)
//
// @param {string} uid
// @returns {Promise<{success, archivedOrders?, authDeleted?, error?}>}
// ═══════════════════════════════════════════════════════════════
export async function adminDeleteUser(uid) {
  try {
    const currentAdmin = auth.currentUser;
    if (!currentAdmin) {
      return { success: false, error: 'You must be signed in as admin.' };
    }
    if (uid === currentAdmin.uid) {
      return {
        success: false,
        error: 'You cannot delete your own admin account.',
      };
    }

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { success: false, error: 'User not found in database.' };
    }

    const userData = userSnap.data();
    if (userData.role === 'admin') {
      return {
        success: false,
        error: 'Cannot delete an admin account from panel.',
      };
    }

    // ─── 1. Archive orders ───────────────────────────────
    const ordersQ = query(
      collection(db, 'orders'),
      where('userId', '==', uid)
    );
    const ordersSnap = await getDocs(ordersQ);
    let archivedCount = 0;
    const archivePromises = [];

    ordersSnap.forEach((orderDoc) => {
      const orderData = orderDoc.data();
      archivePromises.push(
        setDoc(doc(db, 'archivedOrders', orderDoc.id), {
          ...orderData,
          originalOrderId: orderDoc.id,
          archivedAt: new Date().toISOString(),
          archivedReason: 'user_deleted',
          deletedUserId: uid,
          deletedUserEmail: userData.email || '',
          deletedUserName: userData.displayName || '',
        }).then(() => deleteDoc(doc(db, 'orders', orderDoc.id)))
      );
      archivedCount++;
    });

    await Promise.all(archivePromises);

    // ─── 2. Archive user profile ─────────────────────────
    await setDoc(doc(db, 'deletedUsers', uid), {
      ...userData,
      originalUid: uid,
      deletedAt: new Date().toISOString(),
      deletedBy: currentAdmin.uid,
      deletedByEmail: currentAdmin.email || '',
      archivedOrdersCount: archivedCount,
    });

    // ─── 3. Remove active user doc ───────────────────────
    await deleteDoc(userRef);

    // ─── 4. Try Cloud Function to delete Auth user ───────
    let authDeleted = false;
    let authDeleteError = null;
    try {
      const { getFunctions, httpsCallable } = await import(
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-functions.js'
      );
      const functions = getFunctions(app, 'us-central1');
      const deleteAuthUser = httpsCallable(functions, 'deleteAuthUser');
      await deleteAuthUser({ uid });
      authDeleted = true;
    } catch (fnErr) {
      authDeleteError = fnErr.message || String(fnErr);
      console.warn(
        '[adminDeleteUser] Cloud Function deleteAuthUser failed:',
        fnErr
      );
    }

    return {
      success: true,
      archivedOrders: archivedCount,
      authDeleted,
      authDeleteError,
      email: userData.email,
    };
  } catch (error) {
    console.error('adminDeleteUser error:', error);
    return { success: false, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════
// GOOGLE SIGN-IN HELPER
// ═══════════════════════════════════════════════════════════════
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    await setDoc(userRef, {
      email: user.email || '',
      displayName:
        user.displayName || (user.email ? user.email.split('@')[0] : 'User'),
      photoURL: user.photoURL || '',
      role: 'user',
      createdAt: new Date().toISOString(),
      isActive: true,
      emailVerified: !!user.emailVerified,
    });
  }
  return user;
}

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════
export {
  auth,
  db,
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
  deleteField,
  writeBatch,
  runTransaction,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
};