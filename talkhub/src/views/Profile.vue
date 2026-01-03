<template>
  <div class="profile-wrapper">
    <div class="container mt-5">
      <b-card class="profile-card border-0 shadow-lg">
        <!-- Header avec icône -->
        <div class="profile-header text-center mb-4">
          <div class="profile-icon-wrapper mx-auto mb-3">
            <b-icon icon="person-circle" font-scale="3" class="text-white" />
          </div>
          <h2 class="profile-title">Mon Profil</h2>
          <p class="profile-subtitle">Gérez vos informations personnelles</p>
        </div>

        <b-alert variant="danger" v-if="error" dismissible @dismissed="error = ''" class="custom-alert" show>
          <b-icon icon="exclamation-triangle-fill" class="me-2" />
          {{ error }}
        </b-alert>

        <b-alert variant="success" v-if="success" dismissible @dismissed="success = ''" class="custom-alert" show>
          <b-icon icon="check-circle-fill" class="me-2" />
          {{ success }}
        </b-alert>

        <b-form @submit.prevent="updateProfileHandler">
          <b-form-group label="Nom d'utilisateur" label-for="nameInput" class="custom-form-group">
            <b-form-input
              id="nameInput"
              v-model="displayName"
              placeholder="Ex: Jean Dupont"
              class="custom-input"
              size="lg"
            />
          </b-form-group>

          <b-form-group label="Adresse email" label-for="emailInput" class="custom-form-group">
            <b-form-input
              id="emailInput"
              type="email"
              v-model="email"
              disabled
              class="custom-input disabled-input"
              size="lg"
            />
            <div class="input-hint">
              <b-icon icon="info-circle-fill" class="me-1" />
              L'adresse email ne peut pas être modifiée
            </div>
          </b-form-group>

          <b-form-group label="Photo de profil" class="custom-form-group">
            <div class="photo-upload-section">
              <div class="current-photo" v-if="photoURL">
                <b-img
                  :src="photoURL"
                  alt="Photo de profil"
                  class="profile-preview"
                />
                <div class="photo-overlay">
                  <b-icon icon="camera-fill" font-scale="1.5" />
                </div>
              </div>
              <div class="no-photo" v-else>
                <b-icon icon="person-square" font-scale="3" class="text-muted" />
                <p class="text-muted mb-0 mt-2">Aucune photo</p>
              </div>
              
              <div class="file-input-wrapper mt-3">
                <label for="fileInput" class="file-input-label">
                  <b-icon icon="cloud-upload-fill" class="me-2" />
                  Choisir une image
                </label>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                  :class="{'is-invalid': fileState === false}"
                  class="file-input-hidden"
                />
              </div>
              <small class="file-hint">
                <b-icon icon="info-circle" class="me-1" />
                Formats acceptés : JPG, PNG, GIF (Max 2 Mo)
              </small>
            </div>
          </b-form-group>

          <div class="d-grid gap-2 mt-4">
            <b-button type="submit" variant="primary" :disabled="loading" class="submit-button" size="lg">
              <b-icon v-if="loading" icon="arrow-repeat" animation="spin" class="me-2" />
              <b-icon v-else icon="save-fill" class="me-2" />
              {{ loading ? "Enregistrement..." : "Sauvegarder les modifications" }}
            </b-button>
          </div>
        </b-form>
      </b-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getAuth, updateProfile } from "firebase/auth";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const auth = getAuth();
const storage = getStorage();

const displayName = ref("");
const email = ref("");
const photoURL = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");
const selectedFile = ref(null);
const fileState = ref(null);

onMounted(() => {
  const user = auth.currentUser;
  if (user) {
    displayName.value = user.displayName || "";
    email.value = user.email || "";
    photoURL.value = user.photoURL || "";
  }
});

function onFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) { 
      error.value = "La taille de l'image ne doit pas dépasser 2 Mo.";
      fileState.value = false;
      selectedFile.value = null;
    } else {
      error.value = "";
      fileState.value = true;
      selectedFile.value = file;
    }
  }
}

async function uploadPhoto(file, userId) {
  const photoRef = storageRef(storage, `profilePhotos/${userId}/${file.name}`);
  await uploadBytes(photoRef, file);
  return await getDownloadURL(photoRef);
}

async function updateProfileHandler() {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Utilisateur non connecté.");

    let newPhotoURL = photoURL.value;

    if (selectedFile.value) {
      newPhotoURL = await uploadPhoto(selectedFile.value, user.uid);
    }

    await updateProfile(user, {
      displayName: displayName.value,
      photoURL: newPhotoURL,
    });

    await user.reload();

    photoURL.value = newPhotoURL;
    success.value = "Profil mis à jour avec succès.";
  } catch (err) {
    error.value = err.message || "Erreur lors de la mise à jour du profil.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.profile-wrapper {
  min-height: 80vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 700px;
}

.profile-card {
  border-radius: 24px !important;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-header {
  padding-bottom: 2rem;
  border-bottom: 3px solid #e2e8f0;
}

.profile-icon-wrapper {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6);
  }
}

.profile-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.profile-subtitle {
  color: #718096;
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
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

.custom-form-group {
  margin-bottom: 2rem;
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
  background-color: white;
  font-weight: 500;
}

.custom-input:focus {
  border-color: #667eea;
  background-color: #f0f4ff;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
}

.disabled-input {
  background-color: #f7fafc !important;
  color: #a0aec0 !important;
  cursor: not-allowed;
}

.input-hint {
  display: flex;
  align-items: center;
  color: #718096;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

/* Photo upload section */
.photo-upload-section {
  background: #f7fafc;
  padding: 1.5rem;
  border-radius: 16px;
  border: 2px dashed #cbd5e0;
  text-align: center;
}

.current-photo {
  position: relative;
  display: inline-block;
  border-radius: 16px;
  overflow: hidden;
}

.profile-preview {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 16px;
  border: 4px solid white;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(102, 126, 234, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 16px;
  color: white;
}

.current-photo:hover .photo-overlay {
  opacity: 1;
}

.no-photo {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  display: inline-block;
}

.file-input-wrapper {
  position: relative;
}

.file-input-label {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.file-input-label:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.file-input-hidden {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.file-hint {
  display: block;
  margin-top: 0.75rem;
  color: #718096;
  font-size: 0.85rem;
  font-weight: 500;
}

.is-invalid {
  border-color: #e53e3e !important;
}

.submit-button {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  border: none;
  border-radius: 12px;
  padding: 0.9rem 2rem;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(17, 153, 142, 0.4);
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.5);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-card {
    padding: 2rem 1.5rem;
  }
  
  .profile-title {
    font-size: 1.75rem;
  }
  
  .profile-icon-wrapper {
    width: 80px;
    height: 80px;
  }
  
  .profile-preview {
    width: 120px;
    height: 120px;
  }
}
</style>