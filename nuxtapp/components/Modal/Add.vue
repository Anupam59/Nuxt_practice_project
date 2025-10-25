<template>
  <div>
    <!-- Trigger Button -->
    <button @click="showModal = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
      Add Product
    </button>

    <!-- Modal -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add Product</h2>

          <!-- Product Name -->
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">Product Name</label>
            <input v-model="form.name" type="text" placeholder="Enter product name"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <!-- Product Image -->
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">Product Image</label>
            <input type="file" accept="image/*" @change="handleFileChange"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-2">
            <button @click="handleSubmit" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Submit
            </button>
            <button @click="closeModal" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '~/stores/product'

const showModal = ref(false)
const productStore = useProductStore()

const form = ref({
  name: '',
  image: null
})

function handleFileChange(event) {
  const file = event.target.files[0]
  form.value.image = file || null
}

async function handleSubmit() {
  if (!form.value.name || !form.value.image) {
    alert('Please provide a name and select an image.')
    return
  }

  const formData = new FormData()
  formData.append('name', form.value.name)
  formData.append('image', form.value.image)

  await productStore.addProduct(formData)

  form.value = { name: '', image: null }
  showModal.value = false
}

function closeModal() {
  showModal.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>