<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTokenStore } from '~/stores/token'

const auth = useAuthStore()
const token = useTokenStore()
const router = useRouter()

definePageMeta({
  middleware: ['guest'],
})

const form = reactive({
  email: 'anupam.talukdar.ac@gmail.com',
  password: '12345678',
})

async function handleSubmit() {
  const success = await auth.login(form)

  if (success) {
    alert('✅ Login Successful (Session Only)')
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">Login</h5>

        <div>
          <FormLabel>Email</FormLabel>
          <FormTextInput v-model="form.email" type="email" placeholder="Enter email" />
          <p v-if="auth.errors.email" class="text-red-500 text-sm">{{ auth.errors.email }}</p>
        </div>

        <div>
          <FormLabel>Password</FormLabel>
          <FormTextInput v-model="form.password" type="password" placeholder="Enter password" />
          <p v-if="auth.errors.password" class="text-red-500 text-sm">{{ auth.errors.password }}</p>
        </div>

        <p v-if="auth.errors.general" class="text-red-500 text-sm text-center">{{ auth.errors.general }}</p>
        <ButtonPrimary type="submit">Login</ButtonPrimary>
      </form>

      <!-- 🔹 Forgot Password Link -->
      <div class="mt-4 text-center">
        <NuxtLink to="/auth/forgot" class="text-blue-500 hover:underline text-sm">
          Forgot Password?
        </NuxtLink>
      </div>

      <div class="mt-4 text-sm text-center text-gray-600">
        <p>Token: {{ token.getToken }}</p>
        <p>Status: {{ token.getStatus ? 'Logged In' : 'Logged Out' }}</p>
      </div>
    </div>
  </div>
</template>