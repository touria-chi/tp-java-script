<template>
  <div class="forum-page">
    <!-- Hero Section -->
    <div class="hero-section mb-5">
      <div class="container">
        <div class="hero-content text-center">
          <div class="hero-icon mb-4">
            <b-icon icon="people-fill" font-scale="3.5" />
          </div>
          <h1 class="hero-title mb-3">Centre Communautaire</h1>
          <p class="hero-description">Partagez vos expériences, posez vos questions et connectez-vous avec la communauté</p>
        </div>
      </div>
    </div>

    <div class="container py-4">

    <!-- Bouton de création -->
    <div class="action-header mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="section-heading">
          <b-icon icon="chat-dots-fill" class="me-2" />
          Discussions Actives
        </h2>
        <b-button
          variant="success"
          class="create-btn"
          @click="showNewDiscussionForm = !showNewDiscussionForm"
        >
          <b-icon :icon="showNewDiscussionForm ? 'x-lg' : 'plus-lg'" class="me-2" />
          {{ showNewDiscussionForm ? "Annuler" : "Publier" }}
        </b-button>
      </div>
    </div>

    <!-- Formulaire dynamique -->
    <div v-if="showNewDiscussionForm" class="mb-5">
      <NewDiscussionForm @discussion-created="handleDiscussionCreated" />
    </div>

    <!-- Onglets dans une carte stylée -->
    <div class="tabs-wrapper">
      <b-tabs card class="custom-tabs">
        <b-tab active>
          <template #title>
            <div class="tab-header">
              <b-icon icon="clock-history" class="me-2" />
              <span>Récentes</span>
              <span class="tab-badge">{{ filteredDiscussionsRecent.length }}</span>
            </div>
          </template>
          <DiscussionList :discussions="filteredDiscussionsRecent" />
        </b-tab>
        <b-tab>
          <template #title>
            <div class="tab-header">
              <b-icon icon="fire" class="me-2" />
              <span>Tendances</span>
              <span class="tab-badge">{{ filteredDiscussionsPopular.length }}</span>
            </div>
          </template>
          <DiscussionList :discussions="filteredDiscussionsPopular" />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</div>
</template>

<script setup>
// --- AUCUNE MODIFICATION DE LA LOGIQUE ---
import { ref, computed, onMounted } from "vue";
import DiscussionList from "../components/DiscussionList.vue";
import NewDiscussionForm from "../components/NewDiscussionForm.vue";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const discussions = ref([]);
const searchTerm = ref("");
const selectedCategory = ref("all");
const showNewDiscussionForm = ref(false);

const categories = ref([
  { value: "all", text: "Toutes les catégories" },
  { value: "general", text: "Général" },
  { value: "tech", text: "Technologie" },
  { value: "news", text: "Actualités" },
]);

const loading = ref(false);
const error = ref(null);
const categoryOptions = categories.value;

async function loadDiscussions() {
  loading.value = true;
  error.value = null;
  try {
    const q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    discussions.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

const filteredDiscussionsRecent = computed(() => {
  return discussions.value
    .filter((d) => selectedCategory.value === "all" || d.category === selectedCategory.value)
    .filter((d) => d.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
    .slice(0, 10);
});

const filteredDiscussionsPopular = computed(() => {
  return discussions.value
    .filter((d) => selectedCategory.value === "all" || d.category === selectedCategory.value)
    .filter((d) => d.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 10);
});

function onSearch() {}
function filterByCategory() {}
function handleDiscussionCreated() {
  showNewDiscussionForm.value = false;
  loadDiscussions();
}

onMounted(() => {
  loadDiscussions();
});
</script>

<style scoped>
/* Layout principal */
.forum-page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 4rem 0;
  margin: 0 -100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  backdrop-filter: blur(10px);
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
  letter-spacing: -0.5px;
}

.hero-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
}

.container {
  max-width: 1200px;
}

/* Filters Section */
.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: #9ca3af;
  z-index: 10;
  font-size: 1.1rem;
}

.search-input {
  padding-left: 3rem !important;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  height: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.category-select {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  height: 50px;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.3s ease;
}

.category-select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Action Header */
.action-header {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.section-heading {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
}

.section-heading .b-icon {
  color: #667eea;
}

.create-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

/* Tabs Wrapper */
.tabs-wrapper {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  overflow: hidden;
}

:deep(.custom-tabs .nav-tabs) {
  border: none;
  background: #f9fafb;
  padding: 1rem;
  display: flex;
  gap: 1rem;
}

:deep(.custom-tabs .nav-link) {
  border: none !important;
  border-radius: 10px;
  padding: 0.875rem 1.5rem;
  color: #6b7280;
  font-weight: 600;
  transition: all 0.3s ease;
  background: transparent;
}

:deep(.custom-tabs .nav-link:hover) {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

:deep(.custom-tabs .nav-link.active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.tab-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-badge {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  margin-left: 0.5rem;
}

:deep(.custom-tabs .nav-link.active .tab-badge) {
  background: rgba(255, 255, 255, 0.3);
}

:deep(.custom-tabs .nav-link:not(.active) .tab-badge) {
  background: #e5e7eb;
  color: #6b7280;
}

:deep(.card-body) {
  padding: 1.5rem;
  background: #fafafa;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-icon {
    width: 80px;
    height: 80px;
  }
  
  .section-heading {
    font-size: 1.25rem;
  }
  
  .create-btn {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
  
  :deep(.custom-tabs .nav-tabs) {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>