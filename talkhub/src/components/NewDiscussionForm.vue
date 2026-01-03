<template>
  <b-card class="discussion-form-card border-0 shadow-lg">
    <div class="form-header mb-4">
      <div class="d-flex align-items-center">
        <div class="header-icon me-3">
          <b-icon icon="chat-square-text-fill" font-scale="1.8" class="text-white" />
        </div>
        <div>
          <h3 class="form-title mb-1">Nouvelle discussion</h3>
          <p class="form-subtitle mb-0">Partagez vos idées avec la communauté</p>
        </div>
      </div>
    </div>

    <b-form @submit.prevent="handleSubmit">
      <b-form-group label="Titre de la discussion" class="custom-form-group">
        <b-form-input 
          v-model="title" 
          required 
          maxlength="100" 
          placeholder="Ex: Comment débuter en programmation ?" 
          class="custom-input"
          size="lg"
        />
        <small class="char-counter">{{ title.length }} / 100 caractères</small>
      </b-form-group>

      <b-form-group label="Catégorie" class="custom-form-group">
        <b-form-select 
          v-model="category" 
          :options="categories" 
          required 
          class="custom-select"
          size="lg"
        />
      </b-form-group>

      <b-form-group label="Contenu" class="custom-form-group">
        <b-form-textarea 
          v-model="content" 
          rows="6" 
          required 
          maxlength="2000" 
          placeholder="Décrivez votre sujet en détail... Soyez clair et précis pour obtenir de meilleures réponses !" 
          class="custom-textarea"
        />
        <small class="char-counter">{{ content.length }} / 2000 caractères</small>
      </b-form-group>

      <div class="d-flex gap-2 mt-4">
        <b-button type="submit" variant="primary" :disabled="loading" class="submit-button flex-grow-1" size="lg">
          <b-icon v-if="loading" icon="arrow-repeat" animation="spin" class="me-2" />
          <b-icon v-else icon="send-fill" class="me-2" />
          {{ loading ? "Publication..." : "Publier la discussion" }}
        </b-button>
      </div>
    </b-form>

    <b-alert v-if="error" variant="danger" dismissible @dismissed="error=''" class="custom-alert mt-3" show>
      <b-icon icon="x-circle-fill" class="me-2" />
      {{ error }}
    </b-alert>
    <b-alert v-if="success" variant="success" dismissible @dismissed="success=''" class="custom-alert mt-3" show>
      <b-icon icon="check-circle-fill" class="me-2" />
      {{ success }}
    </b-alert>
  </b-card>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../composables/useAuth";

const { user } = useAuth();
const router = useRouter();

const title = ref("");
const category = ref(null);
const content = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const categories = [
  { value: null, text: "Sélectionnez une catégorie", disabled: true },
  { value: "general", text: "Général" },
  { value: "questions", text: "Questions" },
  { value: "ideas", text: "Idées" },
];

async function handleSubmit() {
  if (!user.value) {
    router.push({ path: '/login' });
    return;
  }
  if (!title.value.trim() || !content.value.trim() || !category.value) {
    error.value = "Tous les champs sont obligatoires.";
    return;
  }
  loading.value = true;
  error.value = "";
  try {
    await addDoc(collection(db, "discussions"), {
      title: title.value.trim(),
      category: category.value,
      content: content.value.trim(),
      authorId: user.value.uid,
      authorName: user.value.displayName || user.value.email,
      createdAt: serverTimestamp(),
    });
    success.value = "Discussion créée avec succès.";
    title.value = "";
    content.value = "";
    category.value = null;
  } catch (e) {
    error.value = "Erreur: " + e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.discussion-form-card {
  border-radius: 20px !important;
  padding: 2rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form-header {
  padding-bottom: 1.5rem;
  border-bottom: 3px solid #e2e8f0;
}

.header-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.form-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a202c;
  margin: 0;
}

.form-subtitle {
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
}

.custom-form-group {
  margin-bottom: 1.75rem;
}

:deep(.custom-form-group label) {
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-size: 1.05rem;
  display: block;
}

.custom-input,
.custom-select,
.custom-textarea {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem 1.25rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background-color: white;
  font-weight: 500;
}

.custom-input:focus,
.custom-select:focus,
.custom-textarea:focus {
  border-color: #667eea;
  background-color: #f0f4ff;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.custom-textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
}

.char-counter {
  display: block;
  text-align: right;
  color: #a0aec0;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  padding: 0.9rem 2rem;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.custom-alert {
  border-radius: 12px;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .discussion-form-card {
    padding: 1.5rem;
  }
  
  .form-title {
    font-size: 1.5rem;
  }
  
  .header-icon {
    width: 50px;
    height: 50px;
  }
  
  .custom-input,
  .custom-select,
  .custom-textarea {
    padding: 0.75rem 1rem;
  }
}

/* Animation for character counter */
.char-counter {
  transition: color 0.3s ease;
}

.custom-input:focus ~ .char-counter,
.custom-textarea:focus ~ .char-counter {
  color: #667eea;
}
</style>