<template>
  <div class="responses-wrapper">
    <ResponseItem
      v-for="response in responses"
      :key="response.id"
      :response="response"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
    />
    <b-alert v-if="!responses || responses.length === 0" variant="light" class="empty-state text-center my-5">
      <div class="empty-icon mb-3">
        <!-- <b-icon icon="chat-left-text" font-scale="3" class="text-muted opacity-50" /> -->
      </div>
      <h5 class="fw-bold text-secondary">Aucune réponse pour le moment</h5>
      <p class="text-muted mb-0">Soyez le premier à lancer la conversation !</p>
    </b-alert>
  </div>
</template>

<script setup>
import ResponseItem from "./ResponseItem.vue";

const props = defineProps({
  responses: { type: Array, default: () => [] },
});

const emit = defineEmits(["edit", "delete"]);
</script>

<style scoped>
.responses-wrapper {
  margin-bottom: 1.5rem;
}

.empty-state {
  border-radius: 20px;
  border: 2px dashed #cbd5e0;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 3rem 2rem;
  box-shadow: none;
}

.empty-icon {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>