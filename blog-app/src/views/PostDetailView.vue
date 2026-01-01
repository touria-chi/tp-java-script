<template>
  <div v-if="post" class="post-detail">

    <h1>{{ post.title }}</h1>

    <p class="post-body">{{ post.body }}</p>

    <!-- SECTION DES TAGS -->
    <div class="tags-section">
      <strong>Tags :</strong>

      <span
        v-for="tag in post.tags"
        :key="tag"
        class="tag"
      >
        #{{ tag }}
      </span>
    </div>

    <!-- CLOUD DES TAGS -->
    <TagCloud />
  </div>
</template>

<script>
import { getPost } from '../composables/getPost.js'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import TagCloud from '../components/TagCloud.vue'

export default {
  components: { TagCloud },

  setup() {
    const route = useRoute()
    const { post, fetchPost } = getPost(route.params.id)

    onMounted(fetchPost)

    return { post }
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: auto;
}

.post-body {
  margin: 15px 0 20px;
  line-height: 1.6;
}

.tags-section {
  margin: 20px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px; 
}

.tag {
  background: #894d4dff;
  padding: 5px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  display: inline-block;
}
</style>




