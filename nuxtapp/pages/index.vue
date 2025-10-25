<template>
  <div class="w-full p-4 text-center bg-white border border-gray-200 rounded-lg shadow-sm sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Home Page</h5>
    <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
      This is home page and it is a Nuxt project
    </p>
    <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
      Count - {{ counter.count }}
    </p>
    <button @click="counter.increment()" class="px-4 py-2 bg-blue-500 text-white rounded">
      Increase
    </button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>