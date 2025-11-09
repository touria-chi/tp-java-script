<template>
<div id="app">
    <div class="sidebar">

      
      <div @click="showFiltre" class="filtreCircle" title="Cliquer pour filtrer">Filtrage</div>
      <div v-show="filtrage" id="container">
        <label><input type="radio" value="all" v-model="selectedFilter"> Tout</label><br>
        <label><input type="radio" value="todo" v-model="selectedFilter"> À faire</label><br>
        <label><input type="radio" value="done" v-model="selectedFilter"> Terminées</label>
      </div> 
    </div>
  


    <div class="main">
        <h1>Gestionnaire de tâches</h1>
        <TaskList :filter="selectedFilter" @envoyer-nbr="sendNumber" />
    </div>

    <div class="sidebar">
      <div class="number">{{ count }}</div>
      <h3>Nombre de tâches</h3>

    </div>
    
</div>
</template>

<script>
import TaskList from './components/TaskList.vue'

export default {
  name: 'App',

  components: {
    TaskList,
  },

  data () {
    return {
      filtrage : false,
      selectedFilter : 'all', 
      count : 0 ,
    }
  },
  
  methods : {
    showFiltre () {
      this.filtrage = !this.filtrage;
    },
    sendNumber(value) {
      this.count = value;
    },
  },
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
  font-family: Arial, sans-serif;
}

.sidebar {
  width: 200px;
  background-color: #f0f9ff;
  padding: 20px;
}

.filtreCircle {
  background-color: #1e40af;
  border: 1px solid #1e40af;
  color: white;
  font-size: larger;
  width: 100px;
  text-align: center;
  padding: 37px 0px;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.3s;
}

.filtreCircle:hover , .number:hover {
  background-color: #a5f3fc;
  color: #1e40af;
  border: 1px solid #1e40af;
}

#container {
  margin-top: 20px;
  padding: 10px;
  background-color: #a5f3fc;
  border-radius: 10px;
  text-align: left;
}

#container label {
  display: block;
  margin-bottom: 10px;
}

.main {
  flex-grow: 1;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #1e40af;
}

.number {
  font-size: 70px;
  /* color: #1e40af;
  text-align: center; */
  background-color: #1e40af;
  border: 1px solid #1e40af;
  color: white;
  width: 100px;
  text-align: center;
  padding: 10px 0px;
  border-radius: 50%;
  margin: 0 auto;
  cursor: pointer;
  transition: background-color 0.3s;
}
h3{
  color: #1e40af;
  text-align: center;
}



</style>

