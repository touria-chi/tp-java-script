<template>
  <div class="job-detail-form">
    <h2>Détails du job</h2>

    <label for="title">Titre</label>
    <input id="title" type="text" v-model="title" placeholder="Entrez le titre du poste" />

    <label for="description">Description</label>
    <textarea id="description" v-model="description" placeholder="Entrez la description"></textarea>

    <label for="salary">Salaire</label>
    <input id="salary" type="number" v-model.number="salary" placeholder="Entrez le salaire" />

    <label for="experience">Expérience</label>
    <input id="experience" type="number" v-model.number="experience" placeholder="Années d'expérience" />

    <label for="date">Date</label>
    <input id="date" type="date" v-model="date" />

    <button class="submit-btn" v-on:click="addJob">Enregistrer</button>
  </div>
</template>

<script>
export default {
  name: 'AddJob',


  data() {
    return {
      newJob : {},
      title: '',
      description: '',
      salary: 0,
      experience: 0,
      date: '',
    };
  },

  methods : {
    addJob () {
        this.newJob = {
            "title": this.title,
            "description": this.description,
            "salary": this.salary,
            "experience": this.experience,
            "date": this.date,
            "showDetails" : false 
        };

        console.log('Job ajouté :', this.newJob);


        fetch('http://localhost:3000/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newJob)
        });


        this.title= '';
        this.description= '';
        this.salary= 0;
        this.experience= 0;
        this.date= '';

        this.$router.replace({ name: "Home"});

    },

  },
};
</script>

<style scoped>
.job-detail-form {
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
