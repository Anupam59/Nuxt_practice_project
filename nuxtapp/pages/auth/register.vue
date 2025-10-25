<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useTokenStore } from '~/stores/token'

const router = useRouter()
const auth = useAuthStore()
const token = useTokenStore()

definePageMeta({
  middleware: ['guest'],
})

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

async function handleSubmit() {
  const success = await auth.register(form)

  if (success) {
    alert('Registration Successful!')
    router.push('/dashboard') // Redirect after register
  }
}
</script>

<template>
  <div class="pt-3 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div
      class="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <h5 class="text-xl font-medium text-gray-900 dark:text-white">
          Create your account
        </h5>

        <!-- Name -->
        <div>
          <FormLabel for="name">Your Name</FormLabel>
          <FormTextInput id="name" v-model="form.name" type="text" placeholder="Full name" />
          <p v-if="auth.errors.name" class="text-red-500 text-sm">{{ auth.errors.name }}</p>
        </div>

        <!-- Email -->
        <div>
          <FormLabel for="email">Your Email</FormLabel>
          <FormTextInput id="email" v-model="form.email" type="email" placeholder="Email address" />
          <p v-if="auth.errors.email" class="text-red-500 text-sm">{{ auth.errors.email }}</p>
        </div>

        <!-- Password -->
        <div>
          <FormLabel for="password">Password</FormLabel>
          <FormTextInput id="password" v-model="form.password" type="password" placeholder="*******" />
          <p v-if="auth.errors.password" class="text-red-500 text-sm">{{ auth.errors.password }}</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <FormLabel for="password_confirmation">Confirm Password</FormLabel>
          <FormTextInput
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            placeholder="*******"
          />
          <p v-if="auth.errors.password_confirmation" class="text-red-500 text-sm">
            {{ auth.errors.password_confirmation }}
          </p>
        </div>

        <!-- General error -->
        <p v-if="auth.errors.general" class="text-red-500 text-sm text-center">
          {{ auth.errors.general }}
        </p>

        <ButtonPrimary type="submit">Register</ButtonPrimary>

        <div class="text-sm font-medium text-gray-500 dark:text-gray-300 text-center">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-blue-700 hover:underline dark:text-blue-500">
            Login
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>