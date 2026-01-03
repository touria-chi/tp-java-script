<template>
  <div class="auth-wrapper d-flex justify-content-center align-items-center">
    <div class="auth-container">
      <b-card class="auth-card border-0 shadow-lg">
        <!-- Header avec icône -->
        <div class="text-center mb-4">
          <div class="auth-icon-wrapper mx-auto mb-3">
            <b-icon icon="person-plus-fill" font-scale="2.5" class="text-white" />
          </div>
          <h2 class="auth-title">Rejoignez-nous !</h2>
          <p class="auth-subtitle">Créez votre compte en quelques secondes</p>
        </div>

        <b-alert variant="danger" v-if="error" dismissible @dismissed="error = ''" class="custom-alert">
          <b-icon icon="exclamation-triangle-fill" class="me-2" />
          {{ error }}
        </b-alert>

        <b-form @submit.prevent="handleRegister">

          <b-form-group label="Adresse email" label-for="emailInput" class="custom-form-group">
            <b-form-input
              id="emailInput"
              type="email"
              v-model="email"
              required
              placeholder="votre.email@exemple.com"
              class="custom-input"
              size="lg"
            />
          </b-form-group>

          <b-form-group label="Mot de passe" label-for="passwordInput" class="custom-form-group">
            <b-form-input
              id="passwordInput"
              type="password"
              v-model="password"
              required
              placeholder="Minimum 6 caractères"
              minlength="6"
              class="custom-input"
              size="lg"
            />
            <small class="text-muted d-block mt-1">
              <b-icon icon="info-circle-fill" class="me-1" />
              Le mot de passe doit contenir au moins 6 caractères
            </small>
          </b-form-group>

          <b-button type="submit" variant="success" class="w-100 submit-btn" :disabled="loading" size="lg">
            <b-icon v-if="loading" icon="arrow-repeat" animation="spin" class="me-2" />
            <b-icon v-else icon="check-circle-fill" class="me-2" />
            {{ loading ? "Création en cours..." : "Créer mon compte" }}
          </b-button>
        </b-form>

        <hr class="my-4 divider" />

        <div class="text-center auth-links">
          <p class="mb-2 text-muted">Vous avez déjà un compte ?</p>
          <router-link to="/login" class="link-primary">
            <b-icon icon="box-arrow-in-right" class="me-1" />
            Se connecter maintenant
          </router-link>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const router = useRouter();
const { register } = useAuth();

async function handleRegister() {
  error.value = "";
  loading.value = true;

  try {
    await register(email.value, password.value);
    router.push({ name: "Home" });
  } catch (err) {
    error.value = err.message || "Erreur lors de l'inscription.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 85vh;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  padding: 2rem 1rem;
}

.auth-container {
  max-width: 450px;
  width: 100%;
}

.auth-card {
  border-radius: 24px !important;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.4);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.auth-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #718096;
  font-size: 1rem;
  font-weight: 500;
}

.custom-alert {
  border-radius: 12px;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.2);
}

.custom-form-group {
  margin-bottom: 1.5rem;
}

:deep(.custom-form-group label) {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.custom-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f7fafc;
}

.custom-input:focus {
  border-color: #11998e;
  background-color: white;
  box-shadow: 0 0 0 0.2rem rgba(17, 153, 142, 0.15);
}

.submit-btn {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.5);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  border-top: 2px solid #e2e8f0;
  opacity: 0.5;
}

.auth-links {
  font-size: 0.95rem;
}

.auth-links p {
  font-weight: 500;
  font-size: 0.95rem;
}

.auth-links a {
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.05rem;
}

.link-primary {
  color: #11998e;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(17, 153, 142, 0.1);
}

.link-primary:hover {
  color: #0d7a6e;
  background: rgba(17, 153, 142, 0.2);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 576px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
  
  .auth-title {
    font-size: 1.75rem;
  }
  
  .auth-icon-wrapper {
    width: 70px;
    height: 70px;
  }
}
</style>