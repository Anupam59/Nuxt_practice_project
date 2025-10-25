import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#app'
import { useTokenStore } from './token'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false,
    errors: null,
  }),

  actions: {
    // 🔹 GET - All products
    async fetchProducts() {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()
      this.loading = true
      try {
        const res = await $fetch(`${config.public.apiBase}/products`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${tokenStore.getToken}`,
          },
        })
        this.products = res
      } catch (err) {
        console.error('Error fetching products:', err)
        this.errors = err
      } finally {
        this.loading = false
      }
    },

    // 🔹 POST - Add new product
    async addProduct(formData) {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()
      try {
        const res = await $fetch(`${config.public.apiBase}/products`, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${tokenStore.getToken}`,
          },
        })
        this.products.push(res.product)
      } catch (err) {
        console.error('Error adding product:', err)
        this.errors = err
      }
    },

    // 🔹 DELETE - Remove product by ID
    async deleteProduct(id) {
      const config = useRuntimeConfig()
      const tokenStore = useTokenStore()
      try {
        await $fetch(`${config.public.apiBase}/products/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${tokenStore.getToken}`,
          },
        })
        this.products = this.products.filter(p => p.id !== id)
      } catch (err) {
        console.error('Error deleting product:', err)
        this.errors = err
      }
    },


    // 🔹 PUT - Update product
async updateProduct(id, formData) {
  const config = useRuntimeConfig()
  const tokenStore = useTokenStore()
  try {
    const res = await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'POST', // Laravel API route for update can accept POST + _method=PUT
      body: formData,
      headers: {
        Authorization: `Bearer ${tokenStore.getToken}`,
      },
      params: {
        _method: 'PUT' // Laravel requires this for formData
      }
    })
    // Update local product list
    const index = this.products.findIndex(p => p.id === id)
    if (index !== -1) this.products[index] = res
  } catch (err) {
    console.error('Error updating product:', err)
    this.errors = err
  }
},


  },
})