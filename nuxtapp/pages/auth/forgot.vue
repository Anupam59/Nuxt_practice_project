<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

definePageMeta({
  middleware: ['guest'],
})

const form = reactive({
  email: 'anupam.talukdar.ac@gmail.com',
})

async function handleSubmit() {
    // console.log(form);
  const success = await auth.forgotPassword(form)

  if (success) {
    alert('✅ Reset link sent to your email')
    form.email = '' // clear form
  }
}
</script>

<template>
  <div class="h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white text-center">Forgot Password</h5>
        
        <div>
          <FormLabel>Email</FormLabel>
          <FormTextInput v-model="form.email" type="email" placeholder="Enter your registered email" />
          <p v-if="auth.errors.email" class="text-red-500 text-sm">{{ auth.errors.email }}</p>
        </div>

        <p v-if="auth.errors.general" class="text-red-500 text-sm text-center">{{ auth.errors.general }}</p>
        
        <ButtonPrimary type="submit">Send Reset Link</ButtonPrimary>
      </form>

    </div>
  </div>
</template>