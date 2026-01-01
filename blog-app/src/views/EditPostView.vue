<template>
  <div class="edit-post">
    <h2>Modifier le post</h2>

    <form @submit.prevent="updatePost">
      <div class="form-group">
        <input v-model="title" id="title" required />
        <label for="title">Titre</label>
      </div>

      <div class="form-group">
        <textarea v-model="body" id="body" required></textarea>
        <label for="body">Contenu</label>
      </div>

      <div class="form-group">
        <input v-model="tagsText" id="tags" />
        <label for="tags">Tags (séparés par des virgules)</label>
      </div>

      <button type="submit">Mettre à jour</button>
    </form>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: "EditPostView",
  setup() {
    const route = useRoute()
    const router = useRouter()

    const title = ref('')
    const body = ref('')
    const tagsText = ref('')

    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:3000/posts/${route.params.id}`)
        const data = await res.json()
        title.value = data.title
        body.value = data.body
        tagsText.value = data.tags.join(',')
      } catch (err) {
        console.error("Erreur fetch post:", err)
      }
    }

    onMounted(fetchPost)

    const updatePost = async () => {
      const updatedPost = {
        title: title.value,
        body: body.value,
        tags: tagsText.value.split(',').map(t => t.trim())
      }

      try {
        await fetch(`http://localhost:3000/posts/${route.params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPost)
        })
        alert("Post mis à jour !")
        router.push(`/post/${route.params.id}`)
      } catch (err) {
        console.error("Erreur update post:", err)
      }
    }

    return { title, body, tagsText, updatePost }
  }
}
</script>

<style scoped>
.edit-post {
  max-width: 600px;
  margin: 50px auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,0.08);
}

h2 {
  color: #0d6efd;
  font-weight: 700;
  margin-bottom: 24px;
  text-align: center;
}

.form-group {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

input, textarea {
  width: 100%;
  padding: 16px 14px;
  border-radius: 14px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background: #fafafa;
  transition: all 0.3s ease;
}

input:focus, textarea:focus {
  border-color: #4a8bff;
  background: #fff;
  outline: none;
  box-shadow: 0 0 0 4px rgba(74, 139, 255, 0.15);
}

label {
  position: absolute;
  top: 14px;
  left: 16px;
  color: #888;
  font-size: 0.95rem;
  pointer-events: none;
  transition: 0.2s ease all;
}

input:focus + label,
textarea:focus + label,
input:not(:placeholder-shown) + label,
textarea:not(:placeholder-shown) + label {
  top: -10px;
  left: 12px;
  font-size: 0.8rem;
  color: #4a8bff;
  background: #fff;
  padding: 0 4px;
}

textarea {
  min-height: 150px;
  resize: vertical;
}

button {
  padding: 16px 20px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(90deg, #4a8bff, #2f6df0);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
  transition: all 0.25s ease;
}

button:hover {
  background: linear-gradient(90deg, #2f6df0, #1c52d4);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

button:active {
  transform: translateY(0);
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .edit-post {
    padding: 25px;
  }
}
</style>
