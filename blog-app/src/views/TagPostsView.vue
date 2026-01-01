<template>
  <div class="tag-posts">
    <h2>Articles avec le tag : "{{ tag }}"</h2>

    <SinglePost
      v-for="post in filteredPosts"
      :key="post.id"
      :post="post"
    />

    <p v-if="!filteredPosts.length">
      Aucun article trouvé pour ce tag.
    </p>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '../composables/getPosts.js'
import SinglePost from '../components/SinglePost.vue'

export default {
  components: { SinglePost },

  setup() {
    const route = useRoute()
    const tag = route.params.tag

    const { posts, fetchPosts } = getPosts()
    fetchPosts()

    const filteredPosts = computed(() => {
      return posts.value.filter(post =>
        (post.tags || []).includes(tag)
      )
    })

    return { tag, filteredPosts }
  }
}
</script>
