<script setup>
import { ref, onMounted } from 'vue'
import TaskList from './components/TaskList.vue'

const newTaskTitle = ref('')
</script>

<template>
  <div class="max-w-2xl mx-auto p-8">
    <h1 class="text-4xl font-bold mb-8 text-center">Todo App (fetch + Vitest)</h1>
    
    <TaskList />

    <form class="mt-8 flex gap-4">
      <input
        v-model="newTaskTitle"
        placeholder="Nouvelle tâche..."
        class="flex-1 px-4 py-2 border rounded-lg"
        @keyup.enter="() => newTaskTitle = ''"
      />
      <button
        type="button"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        @click="() => newTaskTitle = ''"
      >
        Ajouter (à venir)
      </button>
    </form>
  </div>
</template>