<script setup>
import { ref, watch } from 'vue'
import { useProductStore } from '~/stores/product'
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig()

const props = defineProps({
  showModal: Boolean,
  productData: Object
})

const emit = defineEmits(['close'])

const productStore = useProductStore()

const form = ref({
  id: null,
  name: '',
  image: null
})

// Pre-fill form when productData changes
watch(() => props.productData, (newVal) => {
  if (newVal) {
    form.value.id = newVal.id
    form.value.name = newVal.name
    form.value.image = newVal.image
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  form.value.image = file || null
}

async function handleSubmit() {
  if (!form.value.name) {
    alert('Please provide a product name.')
    return
  }

  const formData = new FormData()
  formData.append('name', form.value.name)
  if (form.value.image) formData.append('image', form.value.image)

  await productStore.updateProduct(form.value.id, formData)
  
  emit('close')
}
function closeModal() {
  emit('close')
}
</script>

<template>
  <div>
    <!-- Modal -->
    <transition name="fade">
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Product</h2>

          <!-- Product Name -->
          <div class="mb-4">
            <label class="block text-gray-700 dark:text-gray-200 mb-1">Product Name</label>
            <input v-model="form.name" type="text" placeholder="Enter product name"
              class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </div>

          <!-- Image preview -->
          <div class="mb-4">
            <img :src="`${config.public.urlBase}${form.image}`" class="h-12 w-12 object-cover rounded" alt="Product image"/>
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
              Update
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>