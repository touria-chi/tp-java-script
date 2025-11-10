<template>
  <div class="job-card" @click="$emit('click')">
    <h3>{{ job.title }}</h3>
    <p>{{ job.description.substring(0, 50) }}...</p>
    <p>Salary: {{ job.salary }}</p>
  </div>
</template>

<script>
export default {
  props: { job: Object }
}
</script>
