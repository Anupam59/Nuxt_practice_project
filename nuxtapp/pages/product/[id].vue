<script setup>
import { ref } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '~/stores/product'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const config = useRuntimeConfig()

const product = ref(null)
const loading = ref(true)
const error = ref(null)

// Key for reactive reload when ID changes
const key = computed(() => route.params.id)

// Fetch product details
async function fetchProduct(id) {
  loading.value = true
  error.value = null
  try {
    // Check if product exists in Pinia store
    const existing = productStore.products.find(p => Number(p.id) === Number(id))
    if (existing) {
      product.value = existing
    } else {
      // Fetch from API if not in store
      const res = await $fetch(`${config.public.apiBase}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${productStore.getToken}` // যদি টোকেন লাগে
        }
      })
      product.value = res
    }
  } catch (err) {
    error.value = 'Product not found.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Fetch product on mount
onMounted(() => {
  fetchProduct(route.params.id)
})

// Back to product list
function goBack() {
  router.push('/product')
}
</script>

<template>
  <div :key="key" class="p-6">
    <button @click="goBack" class="mb-4 text-blue-600 hover:underline">&larr; Back to Product List</button>

    <div v-if="loading" class="text-gray-500">Loading product details...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <img :src="`${config.public.urlBase}${product.image}`" class="w-full h-64 object-cover rounded mb-4" alt="Product Image"/>
      <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{{ product.name }}</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-2"><strong>Price:</strong> {{ product.price }} USD</p>
      <p class="text-gray-700 dark:text-gray-300 mb-2"><strong>Description:</strong> {{ product.description }}</p>
      <p class="text-gray-700 dark:text-gray-300"><strong>Category:</strong> {{ product.category }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Tailwind CSS ব্যবহার করা হয়েছে */
</style>