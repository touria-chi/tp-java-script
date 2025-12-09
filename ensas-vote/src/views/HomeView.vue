<template>
  <div class="home-container">
    <!-- En-tête -->
    <header class="app-header">
      <div class="header-content">
        <h1> ENSAS Vote</h1>
        <div class="user-info">
          <span v-if="user" class="user-email">{{ user.email }}</span>
          <button @click="logout" class="logout-btn">
            <span>Déconnexion</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Slogan épuré – Option 2, version typographique -->
    <div v-if="user" class="engagement-text">
      <h2>Ton avis compte !</h2>
      <p>Propose, vote, décide — <strong>ensemble, façonnons la vie à l’ENSAS.</strong></p>
    </div>

    <!-- Contenu principal -->
    <main class="main-content">
        <div class="actions-bar">
            <button @click="openCreateModal" class="btn-primary">
            ➕ Proposer un événement
            </button>
        </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Chargement des événements...</p>
      </div>

      <div v-else-if="events.length === 0" class="empty-state">
        <p>Aucun événement n’est disponible pour le moment.</p>
        <p>Revenez plus tard !</p>
      </div>

      <div v-else class="events-grid">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          :current-user="user"
          class="event-card-wrapper"
        />
      </div>
      <!-- Après la grille d'événements -->
    <EventForm v-if="showModal" @close="closeModal" />
    </main>

    <!-- Pied de page -->
    <footer class="app-footer">
      <p>© {{ new Date().getFullYear() }} École Nationale des Sciences Appliquées de Safi (ENSAS)</p>
    </footer>
  </div>
</template>

<script setup>
import EventForm from '../components/EventForm.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, signOut, db } from '../firebase';
import EventCard from '../components/EventCard.vue';

const router = useRouter();
const user = ref(null);
const events = ref([]);
const loading = ref(true);
const showModal = ref(false);


const openCreateModal = () => {
  showModal.value = true;
};

// Le modal se ferme
const closeModal = () => {
  showModal.value = false;
};

onMounted(() => {
  // Auth listener
  const authUnsubscribe = auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      user.value = currentUser;
    } else {
      router.push('/login');
    }
  });

  // Events listener
  const eventsUnsubscribe = onSnapshot(collection(db, 'Events'), (snapshot) => {
    events.value = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // tri par date
    loading.value = false;
  }, (error) => {
    console.error('Erreur Firestore:', error);
    loading.value = false;
  });

  onUnmounted(() => {
    authUnsubscribe();
    eventsUnsubscribe();
  });
});

const logout = () => {
  signOut(auth).then(() => {
    router.push('/login');
  });
};
</script>

<style scoped>

/* ===== TEXT ONLY – STYLE ÉPURÉ (typographie seule) ===== */
.engagement-text {
  text-align: center;
  max-width: 700px;
  margin: 1.8rem auto 2.2rem;
  padding: 0 1rem;
}

.engagement-text h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #0a3a8c;
  margin-bottom: 0.6rem;
  letter-spacing: -0.8px;
  line-height: 1.2;
}

.engagement-text p {
  font-size: 1.2rem;
  font-weight: 500;
  color: #0a3a8c;
  line-height: 1.5;
  margin: 0;
}

.engagement-text p strong {
  color: var(--primary);
  font-weight: 700;
}

  
.actions-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}
.btn-primary {
  background: #0a3a8c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  transform: translateY(-1px);
}
/* ===== VARIABLES GLOBALES ===== */
:root {
  --primary: #0d47a1;
  --primary-light: #1976d2;
  --success: #4caf50;
  --danger: #f44336;
  --background: #f9fbfd;
  --card-bg: white;
  --text: #212121;
  --border: #e0e0e0;
  --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ===== RESET & BASE ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background-color: var(--background);
  color: var(--text);
  line-height: 1.6;
}

/* ===== CONTENEUR PRINCIPAL ===== */
.home-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ===== EN-TÊTE ===== */
.app-header {
  background: #0d47a1 !important;
  color: white !important;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.app-header h1,
.app-header .user-email,
.app-header  {
  color: white !important;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2); /* Ajoute une ombre pour plus de lisibilité */
}
span {
    color: #0d47a1;
}
.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.header-content h1 {
  font-weight: 700;
  font-size: 1.8rem;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.user-email {
  background: rgba(255,255,255,0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
}
.logout-btn {
  background: white;
  color: var(--primary);
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.logout-btn:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

/* ===== CONTENU PRINCIPAL ===== */
.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* Grille d'événements */
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 1.5rem;
}

/* États */
.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0,0,0,0.1);
  border-radius: 50%;
  border-top-color: var(--primary-light);
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ===== PIED DE PAGE ===== */
.app-footer {
  text-align: center;
  padding: 1.5rem;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  .main-content {
    padding: 1.5rem 1rem;
  }
  .events-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .header-content h1 {
    font-size: 1.5rem;
  }
}
</style>