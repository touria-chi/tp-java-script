<template>
  <div class="tag-cloud">
    <router-link
      v-for="tag in uniqueTags"
      :key="tag"
      class="tag-item"
      :to="`/tags/${tag}`"
    >
      #{{ tag }}
    </router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { getPosts } from '../composables/getPosts.js'

export default {
  setup() {
    const { posts, fetchPosts } = getPosts()
    fetchPosts()

    // Extraire les tags uniques
    const uniqueTags = computed(() => {
      if (!posts.value.length) return []
      const tags = posts.value.flatMap(post => post.tags || [])
      return [...new Set(tags)]
    })

    return { uniqueTags }
  }
}
</script>

<style scoped>
.tag-cloud {
  padding: 15px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  width: 220px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.tag-item {
  display: inline-block;
  padding: 6px 12px;
  background: #e0f2ff;
  color: #007bff;
  font-weight: 500;
  font-size: 0.9rem;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background: #cfe8ff;
  transform: scale(1.1);
  color: #0056b3;
}

/* Responsive */
@media (max-width: 768px) {
  .tag-cloud {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
