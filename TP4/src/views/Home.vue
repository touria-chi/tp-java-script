<template>
  <div class="home">
    <h1>Job Management</h1>
    <button @click="showForm = true">Add Job</button>

    <JobForm v-if="showForm" @close="showForm = false" @save="addJob"/>

    <div class="job-list">
      <JobCard 
        v-for="job in jobs" 
        :key="job.id" 
        :job="job" 
        @click.native="goToDetails(job.id)"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useJobsStore } from '../store/jobs'
import JobCard from '../components/JobCard.vue'
import JobForm from '../components/JobForm.vue'
import { useRouter } from 'vue-router'

export default {
  components: { JobCard, JobForm },
  setup() {
    const store = useJobsStore()
    const router = useRouter()
    const showForm = ref(false)

    onMounted(() => {
      store.fetchJobs()
    })

    const addJob = (job) => {
      store.addJob(job)
      showForm.value = false
    }

    const goToDetails = (id) => {
      router.push(`/jobs/${id}`)
    }

    return { jobs: store.jobs, showForm, addJob, goToDetails }
  }
}
</script>
