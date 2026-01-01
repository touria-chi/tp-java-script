import { ref } from 'vue'

export function getPost(id) {
  const post = ref(null)

  async function fetchPost() {
    const res = await fetch(`http://localhost:3000/posts/${id}`)
    post.value = await res.json()
  }

  return { post, fetchPost }
}
