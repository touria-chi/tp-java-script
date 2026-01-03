<template>
  <b-container class="my-4">
    <b-card v-if="discussion" class="mb-4 shadow-sm">
      <h2>{{ discussion.title }}</h2>
      <p class="text-muted">
        Par <strong>{{ discussion.authorName }}</strong> — {{ formatDate(discussion.createdAt) }}
      </p>
      <p>{{ discussion.content }}</p>

      <div v-if="isAuthor(discussion.authorId)">
        <b-button size="sm" variant="warning" @click="editingDiscussion = true">Modifier</b-button>
        <b-button size="sm" variant="danger" @click="deleteDiscussion">Supprimer</b-button>
      </div>
    </b-card>

    
    <b-modal v-model="editingDiscussion" title="Modifier la discussion" @ok="updateDiscussion">
      <b-form-group label="Titre">
        <b-form-input v-model="editTitle" required></b-form-input>
      </b-form-group>
      <b-form-group label="Contenu">
        <b-form-textarea v-model="editContent" rows="5" required></b-form-textarea>
      </b-form-group>
    </b-modal>

    <h4>Réponses ({{ responses.length }})</h4>
    <b-list-group v-if="responses.length > 0">
      <b-list-group-item v-for="response in responses" :key="response.id" class="d-flex justify-content-between align-items-start">
        <div class="flex-grow-1">
          <p class="mb-1">{{ response.content }}</p>
          <small class="text-muted">Par {{ response.authorName }} — {{ formatDate(response.createdAt) }}</small>
        </div>
        <div v-if="isAuthor(response.authorId)" class="ms-2">
          <b-button size="sm" variant="warning" @click="editResponse(response)" class="me-1">Modifier</b-button>
          <b-button size="sm" variant="danger" @click="deleteResponse(response.id)">Supprimer</b-button>
        </div>
      </b-list-group-item>
    </b-list-group>
    <div v-else class="text-center text-muted my-4">
      <p>Aucune réponse pour le moment. Soyez le premier à répondre !</p>
    </div>

    <!-- Formulaire de réponse -->
    <div v-if="user" class="mt-4">
      <b-card>
        <h5 class="mb-3">Ajouter une réponse</h5>
        <NewResponseForm @submit="handleResponseSubmit" />
      </b-card>
    </div>
    <div v-else class="text-center mt-4">
      <b-alert variant="info" show>
        Connectez-vous pour répondre à cette discussion.
      </b-alert>
    </div>

    <b-modal v-model="editingResponse" title="Modifier la réponse" @ok="updateResponse">
      <b-form-textarea v-model="editResponseContent" rows="4" required></b-form-textarea>
    </b-modal>
  </b-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
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
import { useAuth } from "../composables/useAuth";
import NewResponseForm from "../components/NewResponseForm.vue";

const route = useRoute();
const router = useRouter();
const { user, userProfile } = useAuth(); // AJOUT de userProfile

const discussionId = route.params.id;

const discussion = ref(null);
const responses = ref([]);

const editingDiscussion = ref(false);
const editTitle = ref("");
const editContent = ref("");

const editingResponse = ref(false);
const editResponseContent = ref("");
const responseBeingEdited = ref(null);

function formatDate(timestamp) {
  return timestamp ? timestamp.toDate().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }) : "";
}

function isAuthor(authorId) {
  return user.value && user.value.uid === authorId;
}

async function loadDiscussion() {
  try {
    const docRef = doc(db, "discussions", discussionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      discussion.value = { id: docSnap.id, ...docSnap.data() };
      editTitle.value = discussion.value.title;
      editContent.value = discussion.value.content;
    } else {
      alert("Discussion non trouvée !");
      router.push("/");
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la discussion:", error);
    alert("Erreur lors du chargement de la discussion");
  }
}

async function loadResponses() {
  try {
    const q = query(collection(db, "responses"), where("discussionId", "==", discussionId));
    const querySnapshot = await getDocs(q);
    responses.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    // Trier les réponses par date
    responses.value.sort((a, b) => {
      const dateA = a.createdAt?.toMillis() || 0;
      const dateB = b.createdAt?.toMillis() || 0;
      return dateA - dateB;
    });
  } catch (error) {
    console.error("Erreur lors du chargement des réponses:", error);
  }
}

// Fonction appelée par le composant ResponseForm
async function handleResponseSubmit(content) {
  console.log("handleResponseSubmit appelée avec:", content);
  console.log("User complet:", user.value);
  
  if (!content.trim()) {
    console.log("Contenu vide, annulation");
    return;
  }
  
  if (!user.value) {
    alert("Vous devez être connecté pour répondre");
    return;
  }
  
  try {
    console.log("Tentative d'ajout dans Firestore...");
    
    // Récupérer les infos utilisateur depuis Firestore
    const userDocRef = doc(db, "users", user.value.uid);
    const userDoc = await getDoc(userDocRef);
    
    let authorName = user.value.email;
    if (userDoc.exists() && userDoc.data().displayName) {
      authorName = userDoc.data().displayName;
    } else if (user.value.displayName) {
      authorName = user.value.displayName;
    }
    
    console.log("AuthorId:", user.value.uid);
    console.log("AuthorName:", authorName);
    
    const docRef = await addDoc(collection(db, "responses"), {
      content: content.trim(),
      authorId: user.value.uid,
      authorName: authorName,
      discussionId,
      createdAt: serverTimestamp(),
    });
    
    console.log("Réponse ajoutée avec succès, ID:", docRef.id);
    
    // Recharger les réponses
    await loadResponses();
    console.log("Réponses rechargées");
  } catch (error) {
    console.error("Erreur lors de l'ajout de la réponse:", error);
    alert("Erreur lors de l'ajout de la réponse : " + error.message);
  }
}

async function updateDiscussion() {
  if (!editTitle.value.trim() || !editContent.value.trim()) {
    alert("Titre et contenu requis");
    return;
  }
  try {
    const docRef = doc(db, "discussions", discussionId);
    await updateDoc(docRef, {
      title: editTitle.value.trim(),
      content: editContent.value.trim(),
    });
    discussion.value.title = editTitle.value;
    discussion.value.content = editContent.value;
    editingDiscussion.value = false;
  } catch (e) {
    alert("Erreur lors de la modification : " + e.message);
  }
}

async function deleteDiscussion() {
  if (!confirm("Voulez-vous vraiment supprimer cette discussion ?")) return;
  try {
    await deleteDoc(doc(db, "discussions", discussionId));
    router.push("/");
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

function editResponse(response) {
  responseBeingEdited.value = response;
  editResponseContent.value = response.content;
  editingResponse.value = true;
}

async function updateResponse() {
  if (!editResponseContent.value.trim()) {
    alert("Le contenu est requis");
    return;
  }
  try {
    const docRef = doc(db, "responses", responseBeingEdited.value.id);
    await updateDoc(docRef, { content: editResponseContent.value.trim() });
    editingResponse.value = false;
    await loadResponses();
  } catch (e) {
    alert("Erreur lors de la modification : " + e.message);
  }
}

async function deleteResponse(responseId) {
  if (!confirm("Voulez-vous vraiment supprimer cette réponse ?")) return;
  try {
    await deleteDoc(doc(db, "responses", responseId));
    await loadResponses();
  } catch (e) {
    alert("Erreur lors de la suppression : " + e.message);
  }
}

onMounted(async () => {
  await loadDiscussion();
  await loadResponses();
});
</script>

<style scoped>
h2 {
  font-weight: 700;
  color: #2c3e50;
}

h4 {
  font-weight: 600;
  color: #34495e;
  margin-bottom: 1rem;
}

h5 {
  font-weight: 600;
  color: #2c3e50;
}
</style>