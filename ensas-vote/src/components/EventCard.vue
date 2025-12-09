
<template>
  <div class="event-card">
    <img v-if="event.img" :src="event.img" alt="Event" />
    <h3>{{ event.title }}</h3>
    <p>{{ event.description }}</p>
    <p class="event-author">
      Publié par : <strong>{{ event.authorEmail }}</strong>
    </p>
    <p><strong>Date :</strong> {{ new Date(event.date).toLocaleString('fr-FR') }}</p>
    <p><strong>{{ event.isFree ? 'Gratuit' : `Prix : ${event.price} DH` }}</strong></p>

    <div class="votes">
      <span>✅ Yes : {{ event.yesVotes || 0 }}</span>
      <span>❌ No : {{ event.noVotes || 0 }}</span>
    </div>



    <div v-if="loadingVote">Chargement...</div>
    
    <div v-else-if="!currentUser">
      <em>Connectez-vous pour voter</em>
    </div>
    
    <div v-else-if="userHasVoted" class="voted">
      <em>✅ Vous avez voté : <strong>{{ userHasVoted }}</strong></em>
    </div>
    
    <div v-else class="vote-buttons">
      <button @click="vote('yes')"> Yes</button>
      <button @click="vote('no')"> No</button>
    </div>

    <!-- Dans le template, après la section de vote -->
    <div v-if="isAuthor && currentUser" class="event-actions">
      <button @click="deleteEvent" class="btn-delete"> Supprimer</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed  } from 'vue';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { deleteDoc } from 'firebase/firestore';

const props = defineProps({
  event: { type: Object, required: true },
  currentUser: { type: Object, default: null } // reçu de HomeView
});

const isAuthor = computed(() => {
  return props.currentUser?.uid === props.event.authorId;
});

const userHasVoted = ref(null);
const loadingVote = ref(false);


const deleteEvent = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) return;

  try {
    await deleteDoc(doc(db, 'Events', props.event.id));
    // Optionnel : supprimer aussi les votes associés (voir plus bas)
  } catch (error) {
    console.error('Erreur suppression:', error);
    alert('Impossible de supprimer l’événement.');
  }
};


const checkVoteStatus = async () => {
  const user = props.currentUser;
  if (!user || !props.event.id) {
    userHasVoted.value = null;
    return;
  }

  loadingVote.value = true;
  try {
    const voteRef = doc(db, 'Votes', `${user.uid}_${props.event.id}`);
    const voteSnap = await getDoc(voteRef);
    
    if (voteSnap.exists()) {
      userHasVoted.value = voteSnap.data().vote;
    } else {
      userHasVoted.value = null;
    }
  } catch (error) {
    console.error('Erreur vérification vote:', error);
    userHasVoted.value = null;
  }
  loadingVote.value = false;
};

// Relance la vérification si l'utilisateur ou l'événement change
watch(() => [props.currentUser, props.event.id], checkVoteStatus, { immediate: true });

const vote = async (choice) => {
  if (!props.currentUser || userHasVoted.value) return;

  const user = props.currentUser;
  const eventId = props.event.id;
  const voteId = `${user.uid}_${eventId}`;

  try {
    // 1. Enregistrer le vote
    await setDoc(doc(db, 'Votes', voteId), {
      eventId,
      userId: user.uid,
      vote: choice,
      createdAt: new Date()
    });

    // 2. Mettre à jour les compteurs
    const eventRef = doc(db, 'Events', eventId);
    await updateDoc(eventRef, {
      [choice === 'yes' ? 'yesVotes' : 'noVotes']: 
        (props.event[choice === 'yes' ? 'yesVotes' : 'noVotes'] || 0) + 1,
      updatedAt: new Date()
    });

    // 3. Mettre à jour l'UI
    userHasVoted.value = choice;
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    alert('.vote failed. Vérifiez les règles Firestore.');
  }
};
</script>

<style scoped>

.event-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
.btn-delete {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}
.btn-delete:hover {
  background: #d32f2f;
}

.event-author {
  font-size: 0.85rem;
  color: #555;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #eee;
}
.event-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  max-width: 600px;
}
img { width: 100%; border-radius: 4px; }
.votes { margin: 0.5rem 0; font-weight: bold; }
.vote-buttons button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.vote-buttons button:first-child { background: #4caf50; color: white; }
.vote-buttons button:last-child { background: #f44336; color: white; }
.voted { margin-top: 0.5rem; color: #666; font-style: italic; }
</style>