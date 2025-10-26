<script setup>
import { onMounted, ref } from 'vue'
import { useRuntimeConfig } from '#app'
import { useProductStore } from '~/stores/product'
import { useRouter } from 'vue-router'

import ModalAdd from '~/components/Modal/Add.vue'
import ModalEdit from '~/components/Modal/Edit.vue'

const router = useRouter()
const productStore = useProductStore()
const config = useRuntimeConfig()
const showEditModal = ref(false)
const editProductData = ref(null)

definePageMeta({ middleware: ['auth'] })

// Fetch all products on mount
onMounted(() => {
  productStore.fetchProducts()
})

// Open Edit Modal
function openEditModal(product) {
  editProductData.value = product
  showEditModal.value = true
}

// Close Edit Modal
function closeEditModal() {
  showEditModal.value = false
  editProductData.value = null
}

// View product details page
function viewProduct(id) {
  if(id){
  router.push({ path: `/product/${id}` }).catch(err => {
      if (err.name !== 'NavigationDuplicated') console.error(err)
    })
  }
  
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Product List</h1>

    <!-- Add Product Modal -->
    <ModalAdd />

    <!-- Edit Product Modal -->
    <ModalEdit :showModal="showEditModal" :productData="editProductData" @close="closeEditModal" />

    <!-- Product Table -->
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th class="px-6 py-3">Image</th>
            <th class="px-6 py-3">Product Name</th>
            <th class="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product.id"
              class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
            <td class="px-6 py-4">
              <img :src="`${config.public.urlBase}${product.image}`" class="h-12 w-12 object-cover rounded" alt="Product image"/>
            </td>
            <td class="px-6 py-4">{{ product.name }}</td>
            <td class="px-6 py-4 space-x-2">
              <button class="text-blue-600 hover:underline" @click="openEditModal(product)">Edit</button>
              <button class="text-green-600 hover:underline" @click="viewProduct(product.id)">View</button>
              <button class="text-red-600 hover:underline" @click="productStore.deleteProduct(product.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="productStore.products.length === 0">
            <td colspan="3" class="text-center py-4 text-gray-500">No products found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>