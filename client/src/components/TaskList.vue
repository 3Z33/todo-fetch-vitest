<script setup>
import { ref, onMounted } from 'vue'

const tasks = ref([])
const loading = ref(true)
const error = ref(null)

const fetchTasks = async () => {
  try {
    loading.value = true
    const res = await fetch('http://localhost:3000/api/tasks')
    if (!res.ok) throw new Error('Erreur réseau')
    tasks.value = await res.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchTasks)

// Expose la fonction pour que App.vue puisse l’appeler
defineExpose({ fetchTasks })
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold mb-4">Mes tâches</h2>

    <div v-if="loading" class="text-center py-8">Chargement...</div>
    <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div>
    <ul v-else class="space-y-3">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-3 p-3 bg-gray-50 rounded"
      >
        <input type="checkbox" :checked="task.completed" class="w-5 h-5" />
        <span>{{ task.title }}</span>
      </li>
      <li v-if="tasks.length === 0" class="text-gray-500 text-center py-8">
        Aucune tâche pour le moment
      </li>
    </ul>
  </div>
</template>