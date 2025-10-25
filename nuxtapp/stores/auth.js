// stores/auth.js
import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'
import { useTokenStore } from './token'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    errors: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      general: ''
    },
    user: null,
  }),
  persist: true,

  actions: {
    // 🔹 LOGIN
    async login(formData) {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()

      this.errors = { name: '', email: '', password: '', password_confirmation: '', general: '' }

      try {
        const response = await $fetch(`${config.public.apiBase}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        // Token memory তে রাখুন
        tokenStore.setToken(response.access_token)
        this.user = response.user

        return true
      } catch (error) {
        if (error.response?._data?.errors) {
          const vErrors = error.response._data.errors
          this.errors.email = vErrors.email ? vErrors.email[0] : ''
          this.errors.password = vErrors.password ? vErrors.password[0] : ''
        } else if (error.response?._data?.message) {
          this.errors.general = error.response._data.message
        } else {
          this.errors.general = 'Unexpected error. Please try again.'
        }

        return false
      }
    },


    // 🔹 REGISTER
    async register(formData) {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()

      this.errors = { name: '', email: '', password: '', password_confirmation: '', general: '' }

      try {
        const response = await $fetch(`${config.public.apiBase}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        // Token memory তে রাখুন
        tokenStore.setToken(response.access_token)
        this.user = response.user

        return true
      } catch (error) {
        if (error.response?._data?.errors) {
          const vErrors = error.response._data.errors
          this.errors.name = vErrors.name ? vErrors.name[0] : ''
          this.errors.email = vErrors.email ? vErrors.email[0] : ''
          this.errors.password = vErrors.password ? vErrors.password[0] : ''
          this.errors.password_confirmation = vErrors.password_confirmation ? vErrors.password_confirmation[0] : ''
        } else if (error.response?._data?.message) {
          this.errors.general = error.response._data.message
        } else {
          this.errors.general = 'Unexpected error. Please try again.'
        }

        return false
      }
    },

    
  async logout() {
    const config = useRuntimeConfig()
    const tokenStore = useTokenStore()
    try {
      await $fetch(`${config.public.apiBase}/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokenStore.getToken}`,
        },
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
    tokenStore.clearToken()
  }
  
  },
})