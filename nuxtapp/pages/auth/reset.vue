<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

// Form state
const form = reactive({
  email: '',
  token: '',
  password: '',
  password_confirmation: ''
})

// Mounted hook থেকে query parameters set করা
onMounted(() => {
  form.email = route.query.email || ''
  form.token = route.query.token || ''
})

async function handleSubmit() {
  const success = await auth.resetPassword(form)
  if (success) {
    alert('Password reset successful! Please login.')
    router.push('/auth/login')
  }
}
</script>

<template>
  <div class="flex justify-center items-center h-[90vh] bg-gray-100 dark:bg-gray-900">
    <form @submit.prevent="handleSubmit" class="bg-white dark:bg-gray-800 p-6 rounded shadow w-full max-w-md space-y-4">
      <h2 class="text-2xl font-bold text-center text-gray-900 dark:text-white">Reset Password</h2>
      
      <input
        v-model="form.password"
        type="password"
        placeholder="New Password"
        class="border p-2 w-full rounded"
      />

      <input
        v-model="form.password_confirmation"
        type="password"
        placeholder="Confirm Password"
        class="border p-2 w-full rounded"
      />

      <p v-if="auth.errors.general" class="text-red-500 text-sm text-center">{{ auth.errors.general }}</p>

      <button
        type="submit"
        class="bg-green-500 text-white py-2 px-4 rounded w-full hover:bg-green-600"
      >
        Reset Password
      </button>
    </form>
  </div>
</template>