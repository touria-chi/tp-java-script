<template>
  <h1 class="title">ENSA vote</h1>
  <div class="auth-container">
    <h2>{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h2>
    <form @submit.prevent="handleSubmit">
      <input v-model="email" type="email" placeholder="Email universitaire (@uca.ac.ma)" required />
      <input v-model="password" type="password" placeholder="Mot de passe (min 6 caractères)" required />
      <button type="submit">{{ mode === 'login' ? 'Se connecter' : 'S’inscrire' }}</button>
    </form>
    <p>
      {{ mode === 'login' ? "Pas de compte ?" : "Déjà inscrit ?" }}
      <button @click="toggleMode">{{ mode === 'login' ? 'Inscription' : 'Connexion' }}</button>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'vue-router'; // Ajout de useRouter

const email = ref('');
const password = ref('');
const mode = ref('login');
const router = useRouter(); // Initialisez le routeur

const toggleMode = () => {
  mode.value = mode.value === 'login' ? 'register' : 'login';
};

const handleSubmit = async () => {
  try {
    // Optionnel : réactiver plus tard en production
    if (!email.value.endsWith('@uca.ac.ma')) {
      alert('Veuillez utiliser une adresse e-mail universitaire (@uca.ac.ma)');
      return;
    }

    if (mode.value === 'login') {
      await signInWithEmailAndPassword(auth, email.value, password.value);
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
    }

    // REDIRECTION APRÈS SUCCÈS
    router.push('/'); // Redirige vers la page d'accueil
  } catch (error) {
    console.error('Erreur Firebase:', error.code, error.message);
    alert('Erreur : ' + error.message);
  }
};
</script>

<style scoped>
.title {
  color: #1976d2;
  text-align: center;
  /* font-size: 500; */
  font-family:cursive;
}
/* Votre style reste inchangé */
.auth-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%; /* Optionnel : pour un look plus uniforme */
}
</style>