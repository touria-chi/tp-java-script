import { ref } from "vue";
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase"; 

export function useFirestore(collectionName) {
  const documents = ref([]);
  const document = ref(null);
  const loading = ref(false);
  const error = ref(null);

  const colRef = collection(db, collectionName);
  async function getAll(filters = [], order = null) {
    loading.value = true;
    error.value = null;

    try {
      let q = colRef;

      if (filters.length) {
        q = query(q, ...filters);
      }
      if (order) {
        q = query(q, order);
      }

      const snap = await getDocs(q);
      documents.value = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function getById(id) {
    loading.value = true;
    error.value = null;

    try {
      const docRef = doc(colRef, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        document.value = { id: docSnap.id, ...docSnap.data() };
      } else {
        document.value = null;
        error.value = "Document introuvable";
      }
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function add(data) {
    loading.value = true;
    error.value = null;
    try {
      await addDoc(colRef, data);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function update(id, data) {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(colRef, id);
      await updateDoc(docRef, data);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function remove(id) {
    loading.value = true;
    error.value = null;
    try {
      const docRef = doc(colRef, id);
      await deleteDoc(docRef);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return {
    documents,
    document,
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
  };
}
