<template>
  <b-card class="response-item-card mb-4 border-0 shadow-lg">
    <div class="d-flex">
      <!-- Avatar -->
      <div class="response-avatar me-3">
        <span class="avatar-letters">
          {{ getInitials(response.authorName) }}
        </span>
      </div>

      <!-- Contenu -->
      <div class="flex-grow-1">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <strong class="author-name">{{ response.authorName }}</strong>
          <small class="timestamp-badge">
            <!-- <b-icon icon="clock" class="me-1" font-scale="0.9" /> -->
            {{ formatDate(response.createdAt) }}
          </small>
        </div>
        <div class="response-text mb-3">
          {{ response.content }}
        </div>

        <!-- Actions : texte + icône -->
        <div class="d-flex flex-wrap gap-2 mt-3 action-buttons">
          <b-button size="sm" variant="primary" @click="$emit('edit', response)" class="action-btn edit-btn">
            <!-- <b-icon icon="pencil-square" scale="1" class="me-1" /> -->
            Éditer
          </b-button>
          <b-button size="sm" variant="danger" @click="$emit('delete', response.id)" class="action-btn delete-btn">
            <!-- <b-icon icon="trash-fill" scale="1" class="me-1" /> -->
            Supprimer
          </b-button>
          <b-button size="sm" variant="warning" @click="signalMessage" class="action-btn report-btn">
            <!-- <b-icon icon="flag-fill" scale="1" class="me-1" /> -->
            Signaler
          </b-button>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script setup>
import { auth, db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const props = defineProps({
  response: { type: Object, required: true },
});

function formatDate(timestamp) {
  if (!timestamp) return "";
  return timestamp.toDate().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map(n => n[0]?.toUpperCase() || "")
    .join("")
    .substring(0, 2);
}

async function signalMessage() {
  if (!auth.currentUser) {
    alert("Vous devez être connecté pour signaler un message.");
    return;
  }

  try {
    await addDoc(collection(db, "reports"), {
      messageId: props.response.id,
      reportedBy: auth.currentUser.uid,
      reason: "",
      createdAt: serverTimestamp(),
    });
    alert("Merci d'avoir signalé ce message. Nous allons l'examiner.");
  } catch (error) {
    console.error("Erreur :", error);
    alert("Erreur lors du signalement.");
  }
}
</script>

<style scoped>
.response-item-card {
  background: linear-gradient(to bottom right, #ffffff 0%, #f8f9fa 100%);
  border-radius: 18px !important;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.response-item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 18px 0 0 18px;
}

.response-item-card:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2) !important;
}

.response-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
  border: 3px solid #ffffff;
}

.avatar-letters {
  color: white;
  font-weight: 800;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.author-name {
  color: #2d3748;
  font-size: 1.05rem;
  font-weight: 700;
}

.timestamp-badge {
  color: #a0aec0;
  font-weight: 600;
  font-size: 0.85rem;
  background: #edf2f7;
  padding: 0.35rem 0.75rem;
  border-radius: 15px;
  display: inline-flex;
  align-items: center;
}

.response-text {
  color: #4a5568;
  line-height: 1.7;
  white-space: pre-line;
  font-size: 1rem;
  padding: 0.5rem 0;
}

/* Action buttons */
.action-buttons {
  gap: 0.5rem;
}

.action-btn {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  border: none;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.edit-btn:hover {
  background: linear-gradient(135deg, #5568d3 0%, #63408d 100%);
}

.delete-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.delete-btn:hover {
  background: linear-gradient(135deg, #d97fe0 0%, #dc4a5d 100%);
}

.report-btn {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #2d3748;
}

.report-btn:hover {
  background: linear-gradient(135deg, #e86089 0%, #e5ce2f 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .response-item-card {
    padding: 1.25rem;
  }
  
  .response-avatar {
    width: 38px;
    height: 38px;
  }
  
  .avatar-letters {
    font-size: 0.85rem;
  }
  
  .action-btn {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>