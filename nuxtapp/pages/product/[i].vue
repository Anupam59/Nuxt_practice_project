<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTokenStore } from '~/stores/token'

const route = useRoute()
const product = ref(null)
const loading = ref(true)

async function fetchProduct(id) {
  loading.value = true
  try {
    product.value = await $fetch(`/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${useTokenStore().getToken}`,
      },
    })
  } catch (err) {
    console.error('পণ্য লোড করতে সমস্যা:', err)
    product.value = null
  } finally {
    loading.value = false
  }
}

// প্রথমবার পেজ লোড হলে ডেটা ফেচ করা
onMounted(() => {
  fetchProduct(route.params.i)
})

// রাউট প্যারামিটার চেঞ্জ হলে আবার ডেটা ফেচ করা
watch(() => route.params.i, (newId) => {
  fetchProduct(newId)
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Product Details</h1>

    <div v-if="loading">Loading...</div>
    <div v-else-if="product">
      <img :src="product.image" class="h-48 w-48 object-cover rounded" />
      <h2 class="text-xl font-semibold mt-2">{{ product.name }}</h2>
    </div>
    <div v-else class="text-gray-500">Product not found.</div>
  </div>
</template>