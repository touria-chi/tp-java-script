<template>
  <div class="single-post-card">
    <h2 class="title">{{ post.title }}</h2>

    <p class="excerpt">
      {{ post.body.substring(0, 150) }}...
    </p>

    <div class="tag-cloud">
      <span v-for="tag in post.tags" :key="tag" class="tag">
        #{{ tag }}
      </span>
    </div>

    <div class="actions">
      <router-link :to="`/post/${post.id}`" class="read-more">
        Lire la suite
      </router-link>

      <router-link :to="`/edit/${post.id}`" class="edit-btn">
        Modifier
      </router-link>

      <button @click="deletePost(post.id)" class="delete-btn">
        Supprimer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["post"],

  methods: {
    deletePost(id) {
      if (!confirm("Voulez-vous vraiment supprimer ce post ?")) return

      fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" })
        .then(() => location.reload())
        .catch(err => console.error(err));
    }
  }
}
</script>

<style scoped>
.single-post-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: all 0.3s;
}
.single-post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0,0,0,0.12);
}

.title {
  color: #0d6efd;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.excerpt {
  color: #555;
  line-height: 1.5;
  margin-bottom: 12px;
}

.tag-cloud {
  margin-bottom: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag {
  background: #e0f2ff;
  color: #007bff;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s;
}
.tag:hover {
  background: #cfe8ff;
  transform: scale(1.05);
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.read-more {
  color: #0d6efd;
  font-weight: 600;
  text-decoration: none;
}
.edit-btn {
  color: #20c997;
  font-weight: bold;
  text-decoration: none;
}
.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
