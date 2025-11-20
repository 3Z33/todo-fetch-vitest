<script setup>
import { ref, onMounted } from 'vue'

const tasks = ref([])
const loading = ref(true)
const error = ref(null)

const fetchTasks = async () => {
  try {
    loading.value = true
    error.value = null

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`) 

    if (!res.ok) throw new Error(`Erreur ${res.status}`)
    
    const data = await res.json()
    tasks.value = data
  } catch (err) {
    console.error('Fetch error:', err)
    error.value = 'Impossible de charger les tâches'
  } finally {
    loading.value = false
  }
}

const toggleTask = async (id) => {
  await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { method: 'PATCH' })
  await fetchTasks()
}

const deleteTask = async (id) => {
  if (!confirm('Supprimer cette tâche ?')) return
  await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${id}`, { method: 'DELETE' })
  await fetchTasks()
}

onMounted(fetchTasks)

// Expose la fonction pour que App.vue puisse l’appeler
defineExpose({ fetchTasks })
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-semibold mb-4 couleur">Mes tâches</h2>

    <div v-if="loading" class="text-center py-8">Chargement...</div>
    <!-- <div v-else-if="error" class="text-red-600 text-center">{{ error }}</div> -->
    <ul v-else class="space-y-3">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
      >
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="task.completed"
            @change="toggleTask(task.id)"
            class="w-5 h-5"
          />
          <span :class="{ 'line-through text-gray-500': task.completed }">
            {{ task.title }}
          </span>
        </div>
        <button
          @click="deleteTask(task.id)"
          class="text-red-600 hover:text-red-800 text-sm"
        >
          Supprimer
        </button>
      </li>
      <li v-if="tasks.length === 0" class="text-gray-500 text-center py-8">
        Aucune tâche pour le moment
      </li>
    </ul>
  </div>
</template>


<style scoped>

.couleur {
  color: #6a79ff;
}

</style>