<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>Proposer un nouvel événement</h2>
      <form @submit.prevent="submitForm" class="event-form">
        <div class="form-group">
          <label>Titre *</label>
          <input v-model="formData.title" type="text" required maxlength="100" />
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea v-model="formData.description" required maxlength="500"></textarea>
        </div>

        <div class="form-group">
          <label>Date et heure *</label>
          <input v-model="formData.date" type="datetime-local" required />
        </div>

        <div class="form-group">
          <label> Gratuit ?</label>
          <label class="switch">
            <input type="checkbox" v-model="formData.isFree" />
            <span class="slider"></span>
          </label>
        </div>

        <div v-if="!formData.isFree" class="form-group">
          <label>Prix (DH) *</label>
          <input v-model.number="formData.price" type="number" min="1" required />
        </div>

        <div class="form-group">
          <label>URL de l'image (optionnel)</label>
          <input v-model="formData.img" type="url" placeholder="https://exemple.com/image.jpg" />
        </div>

        <div class="form-actions">
          <button type="button" @click="close" class="btn-cancel">Annuler</button>
          <button type="submit" :disabled="isSubmitting" class="btn-submit">
            {{ isSubmitting ? 'Envoi...' : 'Proposer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const emit = defineEmits(['close']);

const formData = reactive({
  title: '',
  description: '',
  date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), // demain
  isFree: true,
  price: 0,
  img: ''
});

const isSubmitting = ref(false);

const submitForm = async () => {
  const user = auth.currentUser;

  if (formData.isFree) {
    formData.price = 0;
  }

  isSubmitting.value = true;
  try {
    await addDoc(collection(db, 'Events'), {
      ...formData,
      authorId: user.uid,           //  ID de l'auteur
      authorEmail: user.email, 
      yesVotes: 0,
      noVotes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    alert('✅ Événement proposé avec succès !');
    emit('close');
  } catch (error) {
    console.error('Erreur:', error);
    alert('❌ Impossible d’ajouter l’événement. Vérifiez les règles Firestore.');
  } finally {
    isSubmitting.value = false;
  }
};

const close = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}
.event-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.form-group label {
  font-weight: 600;
  color: #333;
}
.form-group input,
.form-group textarea {
  padding: 0.6rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-family: inherit;
}
.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

/* Switch personnalisé */
.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #0d47a1;
}
input:checked + .slider:before {
  transform: translateX(26px);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-cancel, .btn-submit {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.btn-cancel {
  background: #f0f0f0;
  color: #333;
}
.btn-submit {
  background: #0d47a1;
  color: white;
}
.btn-submit:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style>