<template>
  <div class="post-list container">
    <SinglePost
      v-for="post in posts"
      :key="post.id"
      :post="post"
      class="post-card"
    />
  </div>
</template>

<script>
import { getPosts } from '../composables/getPosts.js'
import SinglePost from './SinglePost.vue'

export default {
  components: { SinglePost },
  setup() {
    const { posts, fetchPosts } = getPosts()
    fetchPosts()
    return { posts }
  }
}
</script>

<style scoped>
.post-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 25px;
}

.post-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

@media (max-width: 768px) {
  .post-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
