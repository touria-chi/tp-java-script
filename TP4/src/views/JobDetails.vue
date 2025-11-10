<template>
  <div v-if="job">
    <h1>{{ job.title }}</h1>
    <p>{{ job.description }}</p>
    <p>Salary: {{ job.salary }}</p>
    <p>Date: {{ job.date }}</p>
    <p>Experience: {{ job.experience }} years</p>
    <button @click="editJob">Edit</button>
    <button @click="deleteJob">Delete</button>

    <JobForm v-if="showForm" :jobData="job" @save="updateJob" @close="showForm=false"/>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useJobsStore } from '../store/jobs'
import { useRoute, useRouter } from 'vue-router'
import JobForm from '../components/JobForm.vue'

export default {
  components: { JobForm },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useJobsStore()
    const job = ref(null)
    const showForm = ref(false)

    onMounted(async () => {
      await store.fetchJobs()
      job.value = store.jobs.find(j => j.id === parseInt(route.params.id))
    })

    const editJob = () => showForm.value = true

    const updateJob = (updatedJob) => {
      store.updateJob(updatedJob)
      job.value = updatedJob
      showForm.value = false
    }

    const deleteJob = () => {
      if(confirm('Are you sure you want to delete this job?')) {
        store.deleteJob(job.value.id)
        router.push('/')
      }
    }

    return { job, showForm, editJob, updateJob, deleteJob }
  }
}
</script>
