<template>
  <div class="edit-form">
    <h2>Modifier l'emplois</h2>

    <label for="title">Titre</label>
    <input id="title" type="text" v-model="job.title" placeholder="Entrez le titre du poste" />

    <label for="description">Description</label>
    <textarea id="description" v-model="job.description" placeholder="Entrez la description"></textarea>

    <label for="salary">Salaire</label>
    <input id="salary" type="number" v-model.number="job.salary" placeholder="Entrez le salaire" />

    <label for="experience">Expérience</label>
    <input id="experience" type="number" v-model.number="job.experience" placeholder="Années d'expérience" />

    <label for="date">Date</label>
    <input id="date" type="date" v-model="job.date" />


    <button class="submit-btn" v-on:click="modifier(job.id)">Enregistrer</button>
    <button class="submit-btn">
        <router-link :to="{path : '/'}">Annuler</router-link>
    </button>
  </div>
</template>

<script>
export default {
  name: 'EditJob',

  props : ['id'],

  data() {
    return {
      job : {},

    };
  },

  methods : {

    async fetchJob(id) {
      try {
        const res = await fetch(`http://localhost:3000/jobs/${id}`);
        this.job = await res.json();
      } catch (err) {
        console.error("Erreur :", err);
      }
    },
  

    async modifier(id) {
      try {
        await fetch(`http://localhost:3000/jobs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.job)
        });
        this.$router.push({ name: "Home" });
      } catch (err) {
        console.error("Erreur lors de la modification :", err);
      }
    }
    
    
        


      

    

  },




mounted() {
  const id = this.$route.params.id; 
  this.fetchJob(id); 

}



};
</script>

<style scoped>
.edit-form {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: Arial, sans-serif;
}

h2 {
  text-align: center;
  color: #343a40;
  margin-bottom: 1rem;
}

label {
  font-weight: 600;
  color: #495057;
}

input,
textarea {
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;
  width: 100%;
  transition: border 0.2s, box-shadow 0.2s;
}

input:focus,
textarea:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  outline: none;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-btn {
  background-color: #007bff;
  color: #fff;
  font-weight: 600;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.submit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.submit-btn:active {
  transform: translateY(1px);
}
</style>
