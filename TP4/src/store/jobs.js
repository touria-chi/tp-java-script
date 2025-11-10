import { defineStore } from 'pinia'

export const useJobsStore = defineStore('jobs', {
  state: () => ({
    jobs: []
  }),
  actions: {
    async fetchJobs() {
      const res = await fetch('http://localhost:3000/jobs')
      this.jobs = await res.json()
    },
    async addJob(job) {
      const res = await fetch('http://localhost:3000/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      })
      this.jobs.push(await res.json())
    },
    async updateJob(job) {
      await fetch(`http://localhost:3000/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      })
      const index = this.jobs.findIndex(j => j.id === job.id)
      this.jobs[index] = job
    },
    async deleteJob(id) {
      await fetch(`http://localhost:3000/jobs/${id}`, { method: 'DELETE' })
      this.jobs = this.jobs.filter(j => j.id !== id)
    }
  }
})
