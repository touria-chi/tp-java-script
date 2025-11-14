<template>
  <div>
    <div class="home-container">
    <h2>La liste des emplois</h2>
    <ul>
      <li v-for="job in jobs" :key="job.id" class="job-item">
        <h3>{{ job.title }}</h3>
        <p><strong>Date :</strong> {{ job.date }}</p>
        <p class="details" v-on:click="job.showDetails = !job.showDetails">voir details</p>
        <div class="job-detail" v-show="job.showDetails"> <job-detail :Job="job" /> </div>
        <div class="btn-container" v-show="job.showDetails">
          <router-link class="btn" :to="{ name: 'EditJob', params: { id: job.id }}">
            Modifier
          </router-link>
          <button class="ann" @click="openModal(job.id)">Supprimer</button>
        </div>
      </li>
      <li class="job-item ajout">
        <router-link :to="{name: 'AddJob'}">Ajouter un offre</router-link> 
      </li>
    </ul>
    </div>
    <div v-if="showModal" class="overlay" @click="closeModal"></div>

    <div v-if="showModal" class="modal">
      <h3>Confirmer la suppression</h3>
      <p>Voulez-vous vraiment supprimer cet emploi ?</p>

      <div class="btns">
        <button class="yes" @click="confirmDelete">Oui</button>
        <button class="no" @click="closeModal">Annuler</button>
      </div>
    </div>

  </div>

</template>

<script>
import JobDetail from '@/components/JobDetail.vue';

export default {
  name: 'Home', 
  components : {
    JobDetail,
  },


  data() {
    return {

      jobs: [],
      showModal: false,
      jobToDelete: null
  
    }
  },

  methods: {
    async fetchData() {
      try {
        const response = await fetch("http://localhost:3000/jobs") 
        this.jobs = await response.json()
      } catch (error) {
        console.error("Erreur de chargement :", error)
      }
    },

    async supprimer(jobId) {
      try {
        await fetch(`http://localhost:3000/jobs/${jobId}`, { method: 'DELETE' });
        this.jobs = this.jobs.filter(job => job.id !== jobId);
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
      }
    },

    openModal(id) {
      this.jobToDelete = id
      this.showModal = true
    },

    closeModal() {
      this.showModal = false
      this.jobToDelete = null
    },

    async confirmDelete() {
      try {
        await fetch(`http://localhost:3000/jobs/${this.jobToDelete}`, {
          method: "DELETE"
        })

        this.jobs = this.jobs.filter(j => j.id !== this.jobToDelete)

        this.closeModal()

      } catch (err) {
        console.error("Erreur delete :", err)
      }
    }



    
  },


  mounted() {

    this.fetchData();

  },

  

}
</script>

<style >
/* Conteneur général */
.home-container {
  max-width: 700px;
  margin: 2rem auto;
  font-family: Arial, sans-serif;
}


/* Titre */
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

/* Liste */
ul {
  list-style: none;
  padding: 0;
}

/* Chaque job */
.job-item {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.3s;
}

.job-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Titre du job */
.job-item h3 {
  margin: 0 0 0.5rem 0;
  color: #007BFF;
}

/* Date */
.job-item p strong {
  color: #555;
}

/* Voir détails */
.details {
  color: #007BFF;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
}

/* Détails affichés */
.job-detail {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #e9ecef;
  border-radius: 6px;
}

.ajout {
  text-align: center;
}

.ann {
  background-color: red;
  border: 1px solid red;
  font-size:medium;
  color: white;
  margin-top: 5px;
  padding: 10px;
  width: 90px;
  border-radius: 5px;
}
.ann:hover {
  background-color: #fdd75b;
  color: red;
  border: 1px solid red;
}
.btn-container {
  display: flex;
  justify-content:center;
  gap: 10%;
}

.btn {
  background-color: #1e40af;
  border: 1px solid #1e40af;
  font-size:medium;
  color: white;
  margin-top: 5px;
  padding: 10px;
  width: 90px;
  border-radius: 5px;  
}

.btn:hover {
  background-color: #a5f3fc;
  color: #1e40af;
  border: 1px solid #1e40af;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(4px);
  z-index: 10;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  z-index: 20;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

.btns {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

.yes {
  background: red;
  color: white;
  padding: .5rem 1rem;
  border-radius: 5px;
  border: none;
}

.no {
  background: gray;
  color: white;
  padding: .5rem 1rem;
  border-radius: 5px;
  border: none;
}



</style>

