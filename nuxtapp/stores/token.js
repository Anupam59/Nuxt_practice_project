// stores/token.js
import { defineStore } from 'pinia'
import { useAuthStore } from './auth'

export const useTokenStore = defineStore('token', {
  state: () => ({
    token: null,
    loggedIn: false,
  }),
  persist: true,
  getters: {
    getToken: (state) => state.token,
    getStatus: (state) => state.loggedIn,
  },
  actions: {
    setToken(token) {
      this.token = token
      this.loggedIn = true
    },

    clearToken() {
      const auth = useAuthStore();
      auth.$reset();
      this.$reset();
      return navigateTo("/auth/login");
    },
  },
})