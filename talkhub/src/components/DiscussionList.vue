<template>
  <div>
    <b-form-group label="Filtrer par catégorie:">
      <b-form-select v-model="selectedCategory" :options="categories" />
    </b-form-group>

    <b-list-group>
      <DiscussionItem
        v-for="discussion in filteredDiscussions"
        :key="discussion.id"
        :discussion="discussion"
      />
    </b-list-group>

    <b-alert v-if="error" variant="danger">{{ error }}</b-alert>
  </div>
</template>

<script setup>
import { ref, onMounted, computed,watch } from "vue";
import { collection, query, getDocs, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import DiscussionItem from "./DiscussionItem.vue";

const discussions = ref([]);
const error = ref("");
const selectedCategory = ref(null);

const categories = [
  { value: null, text: "Toutes catégories" },
  { value: "general", text: "Général" },
  { value: "questions", text: "Questions" },
  { value: "ideas", text: "Idées" },
];

async function loadDiscussions() {
  error.value = "";
  try {
    let q;
    if (selectedCategory.value) {
      q = query(
        collection(db, "discussions"),
        where("category", "==", selectedCategory.value),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(collection(db, "discussions"), orderBy("createdAt", "desc"));
    }
    const snapshot = await getDocs(q);
    discussions.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(loadDiscussions);

const filteredDiscussions = computed(() => {
  if (!selectedCategory.value) return discussions.value;
  return discussions.value.filter(d => d.category === selectedCategory.value);
});


watch(selectedCategory, loadDiscussions);
</script>
