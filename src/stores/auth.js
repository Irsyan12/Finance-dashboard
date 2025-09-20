import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    async loginWithGoogle() {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (error) console.error(error)
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
    },
    async fetchUser() {
      const { data } = await supabase.auth.getUser()
      this.user = data.user
    }
  }
})
