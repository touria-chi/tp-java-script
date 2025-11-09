<template>
  <!-- Zone HTML : ici tu mets ton interface -->
  <div id="big-container">
        <ul>
            <transition-group name="fade" tag="ul">
            <li v-for="l in filterListe" :key="l.id" :class="{ comp: l.completed }"   @click="modsowAnn(l)" :title="l.completed ?'Cliquer pour annuler/supprimer' : ''">
                <span>Tâche : {{ l.title }}</span>
                <span>Description : {{ l.description }}</span>
                <span :class="l.completed ? 'completed' : 'uncompleted'" >{{ l.completed ? 'terminées ' : "à faire " }}</span>
                <button v-show="!l.completed" class="btn" @click.stop="changer(l)">Terminer</button>
                <div class="btn-container">
                  <button v-show="l.completed && l.showAnn" class="ann" @click.stop="supprimer(l)">Supprimer</button>
                  <button v-show="l.completed && l.showAnn" class="btn" @click.stop="annuler(l)">Annuler</button>
                </div>
                
            </li>
            <li id="none" v-on:click="showAjout"> <img :src="iconUrl" alt="Ajouter"  /></li>
            <li id="form" v-show="showForm">
              <label >Nom de la tâche :</label><br>
              <input type="text" v-model="name" placeholder="Nommer la tâche ..."><br>
              <label >Description :</label><br>
              <textarea v-model="desc" placeholder="Décrire la tâche ..."></textarea><br>
              <div class="btn-container">
                <button class="btn" v-on:click="ajouterTache">Ajouter</button>
                <button class="ann" v-on:click="showAjout">Annuler</button> 
              </div>
                           
            </li>
            </transition-group>
        </ul>
  </div>
</template>

<script setup>
import iconUrl from '@/assets/plus_icone.svg'
</script>

<script>
export default {
  name: 'TaskList', // 🔹 Nom du composant
  props: {
    // 🔹 Ici tu définis les propriétés reçues depuis le parent
    // exemple : title: String
    filter: {
      type: String,
      default: 'all',
    },
  },

  data() {
    return {
      // 🔹 Variables réactives internes au composant
      // exemple : message: ''
      list: [
    {
      "id": 1,
      "title": "Faire les courses",
      "description": "Acheter des légumes et du lait.",
      "completed": false,
      "showAnn": false
    },
    {
      "id": 2,
      "title": "Faire du sport",
      "description": "Courir pendant 30 minutes.",
      "completed": true,
      "showAnn": false
    },
    {
      "id": 3,
      "title": "Réviser pour l'examen",
      "description": "Relire le chapitre 5 du manuel.",
      "completed": false,
      "showAnn": false
    }
  ],
  name : '',
  desc : '',
  showForm : false ,
    }
  },

  computed: {
    // 🔹 Propriétés calculées (valeurs dépendantes des données)
    // exemple : reversedMessage() { return this.message.split('').reverse().join('') }
    filterListe () {
      if (this.filter === 'done') return this.list.filter(l => l.completed);
      else if (this.filter === 'todo') return this.list.filter(l => !l.completed);
      return this.list
    }
  },

  methods: {
    // 🔹 Méthodes du composant
    // exemple : handleClick() { console.log('clic !') }
    envoyerAuParent() {
      this.$emit('envoyer-nbr', this.list.length);
    },
    changer (l) {
      l.completed = true ;
      l.showAnn = false;
    },
    annuler(l) {
      l.completed = false;
      l.showAnn = false;
    }, 
    modsowAnn (l) {
      if (l.completed) { l.showAnn = !l.showAnn }
    },
    showAjout () {
      this.showForm = !this.showForm;
    },
    ajouterTache() {
      const dernierId = this.list.length > 0 ? this.list[this.list.length - 1].id : 0;

      const nouvelleTache = {
        id: dernierId + 1,
        title: this.name,
        description: this.desc,
        completed: false,
        showAnn: false
      };

      this.list.push(nouvelleTache);
      this.name = '';
      this.desc = '';
      this.showForm = false ;

      this.envoyerAuParent();

  },
  supprimer(l){
    this.list = this.list.filter(tache => tache.id !== l.id);
    this.envoyerAuParent();

  }

  },

  mounted() {
    // 🔹 Hook de cycle de vie (appelé quand le composant est monté)
    // exemple : console.log('Composant monté')
    this.envoyerAuParent();
  }
}
</script>

<style scoped>
/* Conteneur général */
#big-container {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f3f4f6; /* gris clair */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

/* Liste */
ul {
  list-style: none; /* Supprime les puces */
  padding: 0;
}

/* Chaque tâche */
li {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 8px;
  border-left: 5px solid #3b82f6; /* bleu à gauche */
  transition: background-color 0.3s;
}
.comp {
  cursor: pointer;
}
/* Survol */
.comp:hover , #none:hover {
  background-color: #e0f2fe; /* léger bleu au survol */
}

#none{
  border-left: none;
}
img {
  width: 10%;
  padding-left: 45%;
}




/* Tâche complétée */
.completed {
  color: green;
  font-weight: bold;
}

.uncompleted {
  color: red;
  font-weight: bold;
}


/* Titres et descriptions */
li span {
  display: block;
  margin-bottom: 5px;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}


input {
  height: 30px;
  width: 90%;
  margin: 10px 0;
}

textarea {
  width: 90%;
  height: 40px;
  margin: 10px 0;
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

</style>

