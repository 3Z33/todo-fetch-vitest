<script setup>
import { ref } from 'vue'
import TaskList from './components/TaskList.vue'

const newTaskTitle = ref('')

const addTask = async () => {
  if (!newTaskTitle.value.trim()) return

  await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: newTaskTitle.value })
  })

  newTaskTitle.value = ''        
  await TaskList.fetchTasks?.()  
}
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Todo App (fetch + Vitest)</h1>
    
    <TaskList ref="TaskList" />

    <form @submit.prevent="addTask" class="mt-8 flex gap-4">
      <input
        v-model="newTaskTitle"
        placeholder="Nouvelle tâche..."
        class="flex-1 px-4 py-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Ajouter
      </button>
    </form>
  </div>
</template>