import { ref } from "vue";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const auth = getAuth();
const user = ref(null);
const userProfile = ref(null); // NOUVEAU : Profil complet de l'utilisateur
const error = ref(null);

export function useAuth() {
  // NOUVEAU : Charger le profil utilisateur depuis Firestore
  async function loadUserProfile(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        userProfile.value = userDoc.data();
      } else {
        userProfile.value = null;
      }
    } catch (err) {
      console.error("Erreur lors du chargement du profil:", err);
      userProfile.value = null;
    }
  }

  // Inscription
  async function register(email, password) {
    error.value = null;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Créer le document utilisateur dans Firestore
      const userData = {
        uid: userCredential.user.uid,
        email: email,
        displayName: userCredential.user.displayName || email.split('@')[0],
        role: "user",
        createdAt: new Date(),
      };
      
      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      user.value = userCredential.user;
      userProfile.value = userData;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  // Connexion
  async function login(email, password) {
    error.value = null;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      user.value = userCredential.user;
      
      // Charger le profil utilisateur
      await loadUserProfile(userCredential.user.uid);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  // Déconnexion
  async function logout() {
    error.value = null;
    try {
      await signOut(auth);
      user.value = null;
      userProfile.value = null;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  // Réinitialiser le mot de passe
  async function resetPassword(email) {
    error.value = null;
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  }

  // Observer l'état de l'authentification
  onAuthStateChanged(auth, async (currentUser) => {
    user.value = currentUser;
    
    if (currentUser) {
      // Charger le profil quand l'utilisateur se connecte
      await loadUserProfile(currentUser.uid);
    } else {
      userProfile.value = null;
    }
  });

  return {
    user,
    userProfile,
    error,
    register,
    login,
    logout,
    resetPassword,
  };
}