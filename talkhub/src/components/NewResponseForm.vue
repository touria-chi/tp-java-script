<template>
  <b-form @submit.prevent="submitResponse" class="forum-response-form">
    <b-form-textarea
      v-model="content"
      placeholder="Écrivez votre réponse ici..."
      rows="3"
      required
      maxlength="1000"
      class="rounded-2 mb-2 forum-textarea"
    />
    <div class="d-flex justify-content-end">
      <b-button type="submit" variant="primary" :disabled="loading || !content.trim()" class="px-4">
        {{ loading ? "Envoi..." : "Publier" }}
      </b-button>
    </div>
  </b-form>
</template>

<script setup>
import { ref } from "vue";
import { useAuth } from "../composables/useAuth";
import { useRouter, useRoute } from 'vue-router';

const emit = defineEmits(["submit"]);
const content = ref("");
const loading = ref(false);
const { user } = useAuth();
const router = useRouter();
const route = useRoute();

async function submitResponse() {
  if (!user.value) {
    // Rediriger vers la page de connexion et revenir après authentification
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  if (!content.value.trim()) {
    alert("La réponse ne peut pas être vide.");
    return;
  }
  
  loading.value = true;
  
  try {
    // Émettre l'événement avec le contenu
    emit("submit", content.value);
    
    // Réinitialiser le contenu après un court délai pour laisser le parent traiter
    setTimeout(() => {
      content.value = "";
      loading.value = false;
    }, 500);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la réponse:", error);
    loading.value = false;
  }
}
</script>

<style scoped>
.forum-textarea {
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  transition: all 0.3s ease;
}

.forum-textarea:focus {
  border-color: #3b82f6;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.forum-response-form .btn {
  font-weight: 600;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
}

.forum-response-form .btn:hover:not(:disabled) {
  box-shadow: 0 3px 6px rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

.forum-response-form .btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>