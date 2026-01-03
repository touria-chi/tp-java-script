<template>
  <div class="container py-5">
    <!-- Bouton création (optionnel ici, mais gardé) -->
    <div class="text-end mb-4">
      <b-button variant="info" size="md" class="create-btn" @click="handleCreateClick">
        <b-icon icon="chat-left-dots-fill" class="me-2" /> Créer une discussion
      </b-button>
    </div>

    <!-- Formulaire de création (si affiché) -->
    <div v-if="showNewDiscussionForm" class="mb-5">
      <NewDiscussionForm 
        @created="onDiscussionCreated" 
        @cancel="showNewDiscussionForm = false" 
      />
    </div>

    <!-- Chargement -->
    <b-card v-if="loadingDiscussion" class="loading-card text-center border-0 shadow-lg py-5">
      <b-spinner variant="info" label="Chargement de la discussion..." style="width: 3rem; height: 3rem;"></b-spinner>
      <p class="mt-3 text-muted fw-semibold">Chargement en cours...</p>
    </b-card>

    <!-- Contenu principal -->
    <b-card v-else class="discussion-card border-0 shadow-lg mb-5">
      <div class="d-flex align-items-start mb-4">
        <!-- Avatar -->
        <div class="author-avatar me-3">
          <span class="avatar-text">
            {{ getInitials(discussion.authorName) }}
          </span>
        </div>
        <div class="flex-grow-1">
          <h1 class="discussion-title mb-2">{{ discussion.title }}</h1>
          <p class="discussion-meta mb-0">
            Publié par <strong class="author-name">{{ discussion.authorName }}</strong> 
            <span class="separator">•</span> 
            <span class="date-text">{{ formatDate(discussion.createdAt) }}</span>
          </p>
        </div>
      </div>
      <hr class="divider-line" />
      <div class="discussion-body">
        {{ discussion.content }}
      </div>
    </b-card>

    <!-- Réponses -->
    <section class="responses-section">
      <div class="d-flex justify-content-between align-items-center mb-4 section-header">
        <h2 class="section-title mb-0">
          <b-icon icon="chat-right-quote-fill" class="me-2 text-success" />
          Réponses <span class="response-count">({{ responses.length }})</span>
        </h2>
      </div>

      <ResponseList
        :responses="responses"
        @edit="onEditResponse"
        @delete="onDeleteResponse"
      />

      <!-- Formulaire de réponse -->
      <b-card class="response-form-card mt-5 border-0 shadow-lg">
        <h3 class="form-title mb-4">
          <b-icon icon="pencil-square" class="me-2 text-warning" />
          Participez à la discussion
        </h3>
        <NewResponseForm @submit="addResponse" />
      </b-card>
    </section>

    <!-- Modale édition -->
    <b-modal
      id="edit-response-modal"
      v-model="showEditModal"
      @hide="resetEditResponse"
      title="✏️ Modifier votre réponse"
      ok-title="Enregistrer"
      cancel-title="Annuler"
      ok-variant="success"
      cancel-variant="outline-secondary"
      size="lg"
      centered
      header-class="modal-header-custom"
      footer-class="modal-footer-custom"
    >
      <b-form-textarea
        v-model="editResponseContent"
        rows="6"
        placeholder="Modifiez votre réponse ici..."
        class="custom-textarea"
      ></b-form-textarea>
    </b-modal>
  </div>
</template>

<script setup>
// ✅ AUCUNE MODIFICATION DE LA LOGIQUE
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import ResponseList from "../components/ResponseList.vue";
import NewResponseForm from "../components/NewResponseForm.vue";
import NewDiscussionForm from "../components/NewDiscussionForm.vue";
import { useAuth } from "../composables/useAuth";

const route = useRoute();

const discussion = ref(null);
const loadingDiscussion = ref(true);
const error = ref(null);
const responses = ref([]);

const showEditModal = ref(false);
const editResponseId = ref(null);
const editResponseContent = ref("");
const showNewDiscussionForm = ref(false);

// Récupérer l'utilisateur connecté et son profil
const { user, userProfile } = useAuth();
import { useRouter } from 'vue-router';
const router = useRouter();

function handleCreateClick() {
  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  showNewDiscussionForm.value = true;
}

// --- Fonctions inchangées ---
async function loadDiscussion() {
  loadingDiscussion.value = true;
  error.value = null;
  try {
    const docRef = doc(db, "discussions", route.params.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      discussion.value = { id: docSnap.id, ...docSnap.data() };
    } else {
      error.value = "Discussion non trouvée";
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingDiscussion.value = false;
  }
}

async function loadResponses() {
  try {
    const q = query(
      collection(db, "responses"),
      where("discussionId", "==", route.params.id)
    );
    const querySnapshot = await getDocs(q);
    responses.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    error.value = err.message;
  }
}

function formatDate(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }) : "";
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0]?.toUpperCase() || "")
    .join("")
    .substring(0, 2);
}

async function addResponse(content) {
  try {
    await addDoc(collection(db, "responses"), {
      content,
      discussionId: route.params.id,
      authorId: user.value ? user.value.uid : "",
      authorName: userProfile.value && userProfile.value.displayName
        ? userProfile.value.displayName
        : user.value
        ? (user.value.displayName || (user.value.email ? user.value.email.split('@')[0] : ''))
        : "",
      createdAt: serverTimestamp(),
    });
    await loadResponses();
  } catch (err) {
    error.value = err.message;
  }
}

function onEditResponse(response) {
  editResponseId.value = response.id;
  editResponseContent.value = response.content;
  showEditModal.value = true;
}

async function saveEditedResponse() {
  if (!editResponseId.value) return;
  try {
    const docRef = doc(db, "responses", editResponseId.value);
    await updateDoc(docRef, { content: editResponseContent.value });
    await loadResponses();
    showEditModal.value = false;
  } catch (err) {
    error.value = err.message;
  }
}

async function onDeleteResponse(responseId) {
  if (!confirm("Voulez-vous supprimer cette réponse ?")) return;
  try {
    await deleteDoc(doc(db, "responses", responseId));
    await loadResponses();
  } catch (err) {
    error.value = err.message;
  }
}

function resetEditResponse() {
  editResponseId.value = null;
  editResponseContent.value = "";
  showEditModal.value = false;
}

function onDiscussionCreated() {
  showNewDiscussionForm.value = false;
}

onMounted(async () => {
  await loadDiscussion();
  await loadResponses();
});
</script>

<style scoped>
.container {
  max-width: 950px;
}

/* Bouton création */
.create-btn {
  border-radius: 50px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(23, 162, 184, 0.3);
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(23, 162, 184, 0.4);
}

/* Loading card */
.loading-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Discussion card */
.discussion-card {
  border-radius: 20px;
  padding: 2rem;
  background: linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%);
}

.author-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.avatar-text {
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
  letter-spacing: 1px;
}

.discussion-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a202c;
  line-height: 1.3;
}

.discussion-meta {
  color: #718096;
  font-size: 0.95rem;
}

.author-name {
  color: #667eea;
  font-weight: 700;
}

.separator {
  margin: 0 0.5rem;
  color: #cbd5e0;
}

.date-text {
  color: #a0aec0;
  font-style: italic;
}

.divider-line {
  margin: 1.5rem 0;
  border-top: 2px solid #e2e8f0;
  opacity: 0.6;
}

.discussion-body {
  color: #2d3748;
  line-height: 1.8;
  white-space: pre-line;
  font-size: 1.05rem;
  padding: 1rem 0;
}

/* Responses section */
.responses-section {
  margin-top: 3rem;
}

.section-header {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a202c;
}

.response-count {
  color: #667eea;
  font-weight: 700;
}

/* Response form card */
.response-form-card {
  border-radius: 20px;
  padding: 2rem;
  background: linear-gradient(135deg, #fff5f7 0%, #ffeef3 100%);
}

.form-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d3748;
}

/* Modal customization */
:deep(.modal-header-custom) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px 20px 0 0;
  padding: 1.5rem;
}

:deep(.modal-header-custom .modal-title) {
  font-weight: 700;
  font-size: 1.25rem;
}

:deep(.modal-header-custom .btn-close) {
  filter: invert(1);
}

:deep(.modal-footer-custom) {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0 0 20px 20px;
}

.custom-textarea {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.custom-textarea:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .discussion-card {
    padding: 1.5rem;
  }
  
  .discussion-title {
    font-size: 1.4rem;
  }
  
  .author-avatar {
    width: 48px;
    height: 48px;
  }
  
  .avatar-text {
    font-size: 1rem;
  }
}
</style>