<template>
        <p>{{ Job.description }}</p>
        <p><strong>Salaire :</strong> {{ Job.salary }} € / mois</p>
        <p><strong>Expérience :</strong> {{ Job.experience }} ans</p>
</template>
<script>
export default {
    name: 'JobDetail' ,
    props : {
        Job : Object ,
    }
}


</script>