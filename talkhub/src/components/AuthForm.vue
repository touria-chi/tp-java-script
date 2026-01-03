<template>
  <b-card class="mx-auto mt-5" style="max-width: 400px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-radius: 12px;">
    <h3 class="mb-4 text-center">{{ isRegister ? "Créer un compte" : "Connexion" }}</h3>

    <b-form @submit.prevent="handleSubmit">
      <b-form-group label="Adresse Email" label-for="email">
        <b-form-input
          id="email"
          type="email"
          v-model="email"
          required
          placeholder="exemple@domaine.com"
          autocomplete="email"
        />
      </b-form-group>

      <b-form-group label="Mot de passe" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="password"
          required
          minlength="6"
          placeholder="Au moins 6 caractères"
          autocomplete="current-password"
        />
      </b-form-group>

      <b-form-group v-if="isRegister" label="Nom d'utilisateur" label-for="displayName">
        <b-form-input
          id="displayName"
          v-model="displayName"
          required
          placeholder="Votre nom affiché"
        />
      </b-form-group>

      <b-button type="submit" variant="primary" class="w-100 mb-3">
        {{ isRegister ? "S'inscrire" : "Se connecter" }}
      </b-button>
    </b-form>

    <div class="text-center mb-3">
      <b-button variant="link" size="sm" @click="toggleMode">
        {{ isRegister ? "Déjà un compte ? Connectez-vous" : "Pas encore de compte ? Inscrivez-vous" }}
      </b-button>
    </div>

    <div class="text-center mb-3">
      <b-button variant="link" size="sm" @click="showReset = !showReset">
        Mot de passe oublié ?
      </b-button>
    </div>

    <b-collapse v-model="showReset" class="mb-3">
      <b-form @submit.prevent="handleReset">
        <b-form-group label="Entrez votre email pour réinitialiser" label-for="resetEmail">
          <b-form-input
            id="resetEmail"
            type="email"
            v-model="resetEmail"
            placeholder="exemple@domaine.com"
            required
          />
        </b-form-group>
        <b-button type="submit" variant="warning" class="w-100">Envoyer email de réinitialisation</b-button>
      </b-form>
    </b-collapse>

    <b-alert
      v-if="errorMessage"
      variant="danger"
      dismissible
      @dismissed="errorMessage = ''"
      class="mt-3"
    >
      {{ errorMessage }}
    </b-alert>

    <b-alert
      v-if="successMessage"
      variant="success"
      dismissible
      @dismissed="successMessage = ''"
      class="mt-3"
    >
      {{ successMessage }}
    </b-alert>
  </b-card>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

const { login, register, resetPassword } = useAuth();

const isRegister = ref(false);
const showReset = ref(false);

const email = ref("");
const password = ref("");
const displayName = ref("");
const resetEmail = ref("");

const errorMessage = ref("");
const successMessage = ref("");

function toggleMode() {
  isRegister.value = !isRegister.value;
  errorMessage.value = "";
  successMessage.value = "";
  email.value = "";
  password.value = "";
  displayName.value = "";
  showReset.value = false;
  resetEmail.value = "";
}

async function handleSubmit() {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    if (isRegister.value) {
      if (!displayName.value.trim()) {
        errorMessage.value = "Le nom d'utilisateur est requis.";
        return;
      }
      await register(email.value, password.value, displayName.value.trim());
      successMessage.value = "Inscription réussie ! Vous pouvez maintenant vous connecter.";
      toggleMode();
    } else {
      await login(email.value, password.value);
      successMessage.value = "Connexion réussie !";
      
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
}

async function handleReset() {
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await resetPassword(resetEmail.value);
    successMessage.value = "Email de réinitialisation envoyé. Vérifiez votre boîte mail.";
    showReset.value = false;
    resetEmail.value = "";
  } catch (error) {
    errorMessage.value = error.message;
  }
}
</script>

<style scoped>
b-card {
  font-family: 'Poppins', sans-serif;
}

h3 {
  font-weight: 700;
  color: #2c3e50;
}

b-button {
  border-radius: 8px;
}
</style>
