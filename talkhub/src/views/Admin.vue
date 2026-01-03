<template>
  <div class="admin-wrapper">
    <div class="container py-5">
      <!-- Header -->
      <div class="admin-header text-center mb-5">
        <div class="admin-icon-wrapper mx-auto mb-3">
        </div>
        <h1 class="admin-title">Panneau d'Administration</h1>
        <p class="admin-subtitle">Gérez les utilisateurs, discussions et signalements</p>
      </div>

      <!-- Alerts -->
      <b-alert v-if="errorMessage" variant="danger" dismissible @dismissed="errorMessage = ''" class="custom-alert" show>
         {{ errorMessage }}
      </b-alert>

      <b-alert v-if="successMessage" variant="success" dismissible @dismissed="successMessage = ''" class="custom-alert" show>
        {{ successMessage }}
      </b-alert>

      <!-- Tabs -->
      <div class="tabs-container">
        <b-tabs card class="admin-tabs">
          <!-- Tab Utilisateurs -->
          <b-tab active>
            <template #title>
              <div class="tab-title">
                <span>Utilisateurs</span>
                <span class="tab-count">{{ users.length }}</span>
              </div>
            </template>
            
            <div v-if="loadingUsers" class="text-center py-5">
              <b-spinner variant="primary" style="width: 3rem; height: 3rem;"></b-spinner>
              <p class="mt-3 text-muted fw-semibold">Chargement des utilisateurs...</p>
            </div>

            <b-table
              v-else
              striped
              hover
              :items="users"
              :fields="userFields"
              responsive
              class="modern-table"
            >
              <template #cell(email)="data">
                <div class="d-flex align-items-center">
                  <div class="user-avatar-small me-2">
                    {{ getInitials(data.item.email) }}
                  </div>
                  <span class="fw-semibold">{{ data.item.email }}</span>
                </div>
              </template>

              <template #cell(role)="data">
                <b-badge 
                  :variant="getRoleBadgeVariant(data.item.role)"
                  class="role-badge"
                >
                  {{ getRoleIcon(data.item.role) }} {{ getRoleLabel(data.item.role) }}
                </b-badge>
              </template>

              <template #cell(actions)="data">
                <div class="action-buttons">
                  <b-button 
                    size="sm" 
                    variant="warning" 
                    @click="toggleModerator(data.item)"
                    class="action-btn me-2"
                  >
                    {{ data.item.role === 'moderator' ? '➖' : '⭐' }}
                    {{ data.item.role === 'moderator' ? 'Rétrograder' : 'Promouvoir' }}
                  </b-button>
                  <b-button 
                    size="sm" 
                    variant="danger" 
                    @click="deleteUser(data.item.id)"
                    class="action-btn"
                  >
                     Supprimer
                  </b-button>
                </div>
              </template>
            </b-table>
          </b-tab>

          <!-- Tab Discussions -->
          <b-tab>
            <template #title>
              <div class="tab-title">
                <span>Discussions</span>
                <span class="tab-count">{{ discussions.length }}</span>
              </div>
            </template>

            <div v-if="loadingDiscussions" class="text-center py-5">
              <b-spinner variant="primary" style="width: 3rem; height: 3rem;"></b-spinner>
              <p class="mt-3 text-muted fw-semibold">Chargement des discussions...</p>
            </div>

            <b-table
              v-else
              striped
              hover
              :items="discussions"
              :fields="discussionFields"
              responsive
              class="modern-table"
            >
              <template #cell(title)="data">
                <router-link :to="`/discussion/${data.item.id}`" class="discussion-link">
                  {{ data.item.title }}
                </router-link>
              </template>

              <template #cell(createdAt)="data">
                <small class="text-muted">
                  {{ formatDate(data.value) }}
                </small>
              </template>

              <template #cell(actions)="data">
                <b-button 
                  size="sm" 
                  variant="danger" 
                  @click="deleteDiscussion(data.item.id)"
                  class="action-btn"
                >
                 Supprimer
                </b-button>
              </template>
            </b-table>
          </b-tab>

          <!-- Tab Signalements -->
          <b-tab>
            <template #title>
              <div class="tab-title">
                <span>Signalements</span>
                <span class="tab-count warning">{{ reports.length }}</span>
              </div>
            </template>

            <div v-if="loadingReports" class="text-center py-5">
              <b-spinner variant="primary" style="width: 3rem; height: 3rem;"></b-spinner>
              <p class="mt-3 text-muted fw-semibold">Chargement des signalements...</p>
            </div>

            <div v-else-if="reports.length === 0" class="empty-state text-center py-5">
              <h5 class="fw-bold text-secondary">Aucun signalement</h5>
              <p class="text-muted">Tous les signalements ont été traités !</p>
            </div>

            <b-table
              v-else
              striped
              hover
              :items="reports"
              :fields="reportFields"
              responsive
              class="modern-table"
            >
              <template #cell(createdAt)="data">
                <small class="text-muted">
                  {{ formatDate(data.value) }}
                </small>
              </template>

              <template #cell(actions)="data">
                <div class="action-buttons">
                  <b-button 
                    size="sm" 
                    variant="success" 
                    @click="resolveReport(data.item.id)"
                    class="action-btn me-2"
                  >
                    ✓ Résoudre
                  </b-button>
                  <b-button 
                    size="sm" 
                    variant="danger" 
                    @click="deleteReportedMessage(data.item.messageId)"
                    class="action-btn"
                  >
                   Supprimer
                  </b-button>
                </div>
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { collection, getDocs, doc, deleteDoc, updateDoc, query } from "firebase/firestore";
import { db } from "../firebase";

const users = ref([]);
const discussions = ref([]);
const reports = ref([]);

const loadingUsers = ref(false);
const loadingDiscussions = ref(false);
const loadingReports = ref(false);

const errorMessage = ref("");
const successMessage = ref("");

const userFields = [
  { key: "email", label: "Email", sortable: true },
  { key: "displayName", label: "Nom", sortable: true },
  { key: "role", label: "Rôle", sortable: true },
  { key: "actions", label: "Actions" },
];

const discussionFields = [
  { key: "title", label: "Titre", sortable: true },
  { key: "authorName", label: "Auteur", sortable: true },
  { key: "createdAt", label: "Date", sortable: true },
  { key: "actions", label: "Actions" },
];

const reportFields = [
  { key: "messageId", label: "Message ID" },
  { key: "reportedBy", label: "Signalé par" },
  { key: "createdAt", label: "Date" },
  { key: "actions", label: "Actions" },
];

function getInitials(email) {
  if (!email) return "?";
  return email.substring(0, 2).toUpperCase();
}

function getRoleLabel(role) {
  const labels = {
    admin: "Administrateur",
    moderator: "Modérateur",
    user: "Utilisateur",
  };
  return labels[role] || "Utilisateur";
}

function getRoleBadgeVariant(role) {
  const variants = {
    admin: "danger",
    moderator: "warning",
    user: "secondary",
  };
  return variants[role] || "secondary";
}

function getRoleIcon(role) {
  const icons = {
    admin: "🛡️",
    moderator: "⭐",
    user: "👤",
  };
  return icons[role] || "👤";
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  return timestamp.toDate().toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadUsers() {
  loadingUsers.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    users.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des utilisateurs : " + error.message;
  } finally {
    loadingUsers.value = false;
  }
}

async function loadDiscussions() {
  loadingDiscussions.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "discussions"));
    const querySnapshot = await getDocs(q);
    discussions.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des discussions : " + error.message;
  } finally {
    loadingDiscussions.value = false;
  }
}

async function loadReports() {
  loadingReports.value = true;
  errorMessage.value = "";
  try {
    const q = query(collection(db, "reports"));
    const querySnapshot = await getDocs(q);
    reports.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    errorMessage.value = "Erreur lors du chargement des signalements : " + error.message;
  } finally {
    loadingReports.value = false;
  }
}

async function deleteUser(userId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return;
  try {
    await deleteDoc(doc(db, "users", userId));
    successMessage.value = "Utilisateur supprimé avec succès.";
    await loadUsers();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression de l'utilisateur : " + error.message;
  }
}

async function toggleModerator(user) {
  const newRole = user.role === "moderator" ? "user" : "moderator";
  const action = newRole === "moderator" ? "promu modérateur" : "rétrogradé utilisateur";
  
  if (!confirm(`Voulez-vous vraiment changer le rôle de ${user.email} ?`)) return;
  
  try {
    const userRef = doc(db, "users", user.id);
    await updateDoc(userRef, { role: newRole, updatedAt: new Date() });
    successMessage.value = `${user.email} a été ${action}.`;
    await loadUsers();
  } catch (error) {
    errorMessage.value = "Erreur lors de la mise à jour du rôle : " + error.message;
  }
}

async function deleteDiscussion(discussionId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette discussion ?")) return;
  try {
    await deleteDoc(doc(db, "discussions", discussionId));
    successMessage.value = "Discussion supprimée avec succès.";
    await loadDiscussions();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression de la discussion : " + error.message;
  }
}

async function resolveReport(reportId) {
  if (!confirm("Marquer ce signalement comme résolu ?")) return;
  try {
    await deleteDoc(doc(db, "reports", reportId));
    successMessage.value = "Signalement résolu avec succès.";
    await loadReports();
  } catch (error) {
    errorMessage.value = "Erreur lors de la résolution du signalement : " + error.message;
  }
}

async function deleteReportedMessage(messageId) {
  if (!confirm("Supprimer définitivement le message signalé ?")) return;
  try {
    const discussionRef = doc(db, "discussions", messageId);
    await deleteDoc(discussionRef);
    successMessage.value = "Message supprimé avec succès.";
    await loadReports();
    await loadDiscussions();
  } catch (error) {
    errorMessage.value = "Erreur lors de la suppression du message : " + error.message;
  }
}

onMounted(() => {
  loadUsers();
  loadDiscussions();
  loadReports();
});
</script>

<style scoped>
.admin-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
}

/* Header */
.admin-header {
  margin-bottom: 2rem;
}

.admin-icon-wrapper {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.header-icon {
  font-size: 3rem;
}

.admin-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 0.5rem;
}

.admin-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
}

/* Alerts */
.custom-alert {
  border-radius: 12px;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
}

/* Tabs Container */
.tabs-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

:deep(.admin-tabs .nav-tabs) {
  border: none;
  background: #f8f9fa;
  padding: 1.5rem 1.5rem 0;
  gap: 1rem;
}

:deep(.admin-tabs .nav-link) {
  border: none !important;
  border-radius: 12px 12px 0 0;
  padding: 1rem 1.5rem;
  color: #6b7280;
  font-weight: 700;
  transition: all 0.3s ease;
  background: transparent;
}

:deep(.admin-tabs .nav-link:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

:deep(.admin-tabs .nav-link.active) {
  background: white;
  color: #667eea;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.tab-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-icon {
  font-size: 1.2rem;
}

.tab-count {
  background: #e5e7eb;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-left: 0.5rem;
}

:deep(.admin-tabs .nav-link.active .tab-count) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.tab-count.warning {
  background: #fef3c7;
  color: #92400e;
}

:deep(.card-body) {
  padding: 2rem;
  background: white;
}

/* Table moderne */
:deep(.modern-table) {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

:deep(.modern-table thead th) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: 700;
  border: none;
  padding: 1rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

:deep(.modern-table tbody tr) {
  transition: all 0.2s ease;
}

:deep(.modern-table tbody tr:hover) {
  background: #f0f4ff;
  transform: scale(1.01);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.modern-table td) {
  padding: 1rem;
  vertical-align: middle;
  border-color: #e5e7eb;
}

/* User Avatar Small */
.user-avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* Role Badge */
.role-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Discussion Link */
.discussion-link {
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.discussion-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Empty State */
.empty-state {
  padding: 3rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

/* Loading State */
:deep(.spinner-border) {
  border-width: 0.3rem;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-wrapper {
    padding: 1rem 0;
  }

  .admin-title {
    font-size: 2rem;
  }

  .admin-icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .header-icon {
    font-size: 2.5rem;
  }

  :deep(.admin-tabs .nav-tabs) {
    padding: 1rem 1rem 0;
    gap: 0.5rem;
  }

  :deep(.admin-tabs .nav-link) {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .tab-count {
    padding: 0.2rem 0.6rem;
    font-size: 0.75rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  :deep(.card-body) {
    padding: 1rem;
  }
}
</style>