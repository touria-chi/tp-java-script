<template>
  <div class="job-form">
    <h2>{{ job.id ? 'Edit Job' : 'Add Job' }}</h2>
    <form @submit.prevent="submitForm">
      <input v-model="job.title" placeholder="Title" required/>
      <textarea v-model="job.description" placeholder="Description" required></textarea>
      <input v-model.number="job.salary" placeholder="Salary" type="number" required/>
      <input v-model="job.date" type="date" required/>
      <input v-model.number="job.experience" placeholder="Years of experience" type="number" required/>
      <button type="submit">Save</button>
      <button @click="$emit('close')">Cancel</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  props: { jobData: Object },
  setup(props, { emit }) {
    const job = ref(props.jobData || { title: '', description: '', salary: 0, date: '', experience: 0 })

    const submitForm = () => {
      emit('save', job.value)
    }

    return { job, submitForm }
  }
}
</script>
