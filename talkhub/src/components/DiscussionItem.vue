<template>
  <b-list-group-item
    class="discussion-card-item px-0 py-3 border-0"
    tag="div"
  >
    <router-link
      :to="{ name: 'Discussion', params: { id: discussion.id } }"
      class="d-flex align-items-start text-decoration-none card-link"
    >
      <!-- Avatar -->
      <div class="user-avatar me-3 flex-shrink-0">
        <span class="avatar-initials">
          {{ getInitials(discussion.authorName) }}
        </span>
      </div>
      <!-- Contenu -->
      <div class="flex-grow-1 overflow-hidden">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h3 class="card-title mb-0">
            {{ discussion.title }}
          </h3>
          <small class="time-badge">
            <b-icon icon="clock-fill" class="me-1" />
            {{ formatDate(discussion.createdAt) }}
          </small>
        </div>
        <div class="d-flex align-items-center author-info">
          <b-icon icon="person-fill" class="me-1 text-info" font-scale="0.9" />
          <span class="author-text">{{ discussion.authorName }}</span>
          <b-badge
            v-if="discussion.category"
            variant="primary"
            class="category-badge ms-3"
          >
            <b-icon icon="tag-fill" class="me-1" font-scale="0.8" />
            {{ getCategoryLabel(discussion.category) }}
          </b-badge>
        </div>
      </div>
    </router-link>
  </b-list-group-item>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  discussion: {
    type: Object,
    required: true,
  },
});

const categoryLabels = {
  general: "Général",
  tech: "Technologie",
  news: "Actualités",
  questions: "Questions",
  ideas: "Idées",
};

function getCategoryLabel(value) {
  return categoryLabels[value] || value;
}

function formatDate(timestamp) {
  if (!timestamp) return "";
  const date = timestamp.toDate();
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
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
</script>

<style scoped>
.discussion-card-item {
  background: transparent;
  transition: all 0.3s ease;
}

.card-link {
  color: inherit;
  padding: 1.25rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  background: linear-gradient(to right, #ffffff 0%, #f8fafc 100%);
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.card-link:hover {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
  border-color: #667eea;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.2);
  transform: translateY(-3px);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(17, 153, 142, 0.3);
  transition: transform 0.3s ease;
}

.card-link:hover .user-avatar {
  transform: scale(1.1) rotate(5deg);
}

.avatar-initials {
  color: white;
  font-weight: 800;
  font-size: 1rem;
  letter-spacing: 0.5px;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  line-height: 1.4;
  color: #1a202c;
  max-width: 85%;
  transition: color 0.3s ease;
}

.card-link:hover .card-title {
  color: #667eea;
}

.time-badge {
  color: #a0aec0;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  background: #edf2f7;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
}

.author-info {
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.author-text {
  font-weight: 600;
  color: #4a5568;
}

.category-badge {
  font-weight: 700;
  font-size: 0.85rem;
  padding: 0.4rem 0.9rem;
  border-radius: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
  display: inline-flex;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .card-link {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1rem;
    max-width: 100%;
  }
  
  .time-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
  }
  
  .user-avatar {
    width: 40px;
    height: 40px;
  }
  
  .avatar-initials {
    font-size: 0.9rem;
  }
}
</style>