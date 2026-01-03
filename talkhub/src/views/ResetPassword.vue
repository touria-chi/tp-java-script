<template>
  <div class="reset-wrapper d-flex justify-content-center align-items-center">
    <div class="reset-container">
      <b-card class="reset-card border-0 shadow-lg">
        <!-- Header avec icône -->
        <div class="text-center mb-4">
          <div class="reset-icon-wrapper mx-auto mb-3">
            <b-icon icon="key-fill" font-scale="2.5" class="text-white" />
          </div>
          <h2 class="reset-title">Mot de passe oublié ?</h2>
          <p class="reset-subtitle">Pas de souci, nous allons vous aider à le récupérer</p>
        </div>

        <b-alert v-if="message" variant="success" dismissible @dismissed="message = ''" class="custom-alert" show>
          <b-icon icon="envelope-check-fill" class="me-2" />
          {{ message }}
        </b-alert>
        
        <b-alert v-if="error" variant="danger" dismissible @dismissed="error = ''" class="custom-alert" show>
          <b-icon icon="exclamation-circle-fill" class="me-2" />
          {{ error }}
        </b-alert>

        <b-form @submit.prevent="handleReset">
          <b-form-group label="Adresse email" class="custom-form-group">
            <b-form-input 
              v-model="email" 
              type="email" 
              required 
              placeholder="votre.email@exemple.com"
              class="custom-input"
              size="lg"
            />
            <small class="input-hint">
              <b-icon icon="info-circle-fill" class="me-1" />
              Entrez l'email associé à votre compte
            </small>
          </b-form-group>

          <b-button type="submit" variant="primary" class="w-100 submit-button" size="lg">
            <b-icon icon="send-fill" class="me-2" />
            Envoyer le lien de réinitialisation
          </b-button>
        </b-form>

        <hr class="my-4 divider" />

        <div class="text-center">
          <p class="mb-2 text-muted">Vous vous souvenez de votre mot de passe ?</p>
          <router-link to="/login" class="link-back">
            <b-icon icon="arrow-left-circle-fill" class="me-1" />
            Retour à la connexion
          </router-link>
        </div>
      </b-card>

      <!-- Info card -->
      <b-card class="info-card border-0 shadow-sm mt-4">
        <div class="d-flex align-items-start">
          <div class="info-icon me-3">
            <b-icon icon="shield-check" font-scale="1.5" class="text-success" />
          </div>
          <div>
            <h6 class="fw-bold mb-2">Comment ça fonctionne ?</h6>
            <ul class="info-list mb-0">
              <li>Vous recevrez un email de réinitialisation</li>
              <li>Cliquez sur le lien dans l'email</li>
              <li>Créez votre nouveau mot de passe</li>
              <li>Reconnectez-vous avec vos nouveaux identifiants</li>
            </ul>
          </div>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";

export default {
  setup() {
    const email = ref("");
    const message = ref("");
    const { resetPassword, error } = useAuth();

    const handleReset = async () => {
      message.value = "";
      try {
        await resetPassword(email.value);
        message.value = "Email de réinitialisation envoyé. Vérifiez votre boîte mail.";
        email.value = "";
      } catch (e) {
        // Error handled by useAuth composable
      }
    };

    return { email, message, error, handleReset };
  },
};
</script>

<style scoped>
.reset-wrapper {
  min-height: 85vh;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  padding: 2rem 1rem;
}

.reset-container {
  max-width: 500px;
  width: 100%;
}

.reset-card {
  border-radius: 24px !important;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  animation: slideIn 0.5s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.reset-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(250, 112, 154, 0.4);
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-5deg);
  }
  75% {
    transform: rotate(5deg);
  }
}

.reset-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.reset-subtitle {
  color: #718096;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
}

.custom-alert {
  border-radius: 12px;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-form-group {
  margin-bottom: 1.5rem;
}

:deep(.custom-form-group label) {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
}

.custom-input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: #f7fafc;
  font-weight: 500;
}

.custom-input:focus {
  border-color: #fa709a;
  background-color: white;
  box-shadow: 0 0 0 0.2rem rgba(250, 112, 154, 0.15);
  transform: translateY(-1px);
}

.input-hint {
  display: flex;
  align-items: center;
  color: #718096;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.submit-button {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.5rem;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(250, 112, 154, 0.4);
  transition: all 0.3s ease;
  margin-top: 1rem;
  color: #1a202c;
}

.submit-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(250, 112, 154, 0.5);
}

.divider {
  border-top: 2px solid #e2e8f0;
  opacity: 0.5;
}

.link-back {
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  color: #fa709a;
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(250, 112, 154, 0.1);
  transition: all 0.3s ease;
}

.link-back:hover {
  background: rgba(250, 112, 154, 0.2);
  color: #e8608a;
  transform: translateY(-1px);
}

/* Info card */
.info-card {
  border-radius: 20px !important;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.6s ease 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-card h6 {
  color: #2d3748;
  font-size: 1.05rem;
}

.info-list {
  list-style: none;
  padding: 0;
  color: #4a5568;
  font-size: 0.9rem;
  line-height: 1.8;
}

.info-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.info-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #38a169;
  font-weight: bold;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 576px) {
  .reset-card {
    padding: 2rem 1.5rem;
  }
  
  .reset-title {
    font-size: 1.75rem;
  }
  
  .reset-icon-wrapper {
    width: 70px;
    height: 70px;
  }
  
  .info-card {
    padding: 1.25rem;
  }
}
</style>