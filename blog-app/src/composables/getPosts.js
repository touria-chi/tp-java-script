import { ref } from 'vue'

export function getPosts() {
  const posts = ref([])

  async function fetchPosts() {
    const res = await fetch('http://localhost:3000/posts')
    posts.value = await res.json()
  }

  return { posts, fetchPosts }
}
