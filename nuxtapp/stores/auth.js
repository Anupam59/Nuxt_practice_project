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
      this.resetErrors()

      try {
        const response = await $fetch(`${config.public.apiBase}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        tokenStore.setToken(response.access_token)
        this.user = response.user
        return true

      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    // 🔹 REGISTER
    async register(formData) {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()
      this.resetErrors()

      try {
        const response = await $fetch(`${config.public.apiBase}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        tokenStore.setToken(response.access_token)
        this.user = response.user
        return true

      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    // 🔹 FORGOT PASSWORD
    async forgotPassword(formData) {
      const config = useRuntimeConfig()
      this.resetErrors()

      try {
        const response = await $fetch(`${config.public.apiBase}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        alert(response.message || 'Reset link sent successfully!')
        return true

      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    // 🔹 RESET PASSWORD
    async resetPassword(formData) {
      const config = useRuntimeConfig()
      this.resetErrors()

      try {
        const response = await $fetch(`${config.public.apiBase}/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: formData,
        })

        alert(response.message || 'Password reset successfully!')
        return true

      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    // 🔹 LOGOUT
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
      this.user = null
    },

    // 🔹 Helper Functions
    resetErrors() {
      this.errors = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        general: ''
      }
    },

    handleError(error) {
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
    }
  },
})