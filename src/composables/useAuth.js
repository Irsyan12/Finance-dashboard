import { supabase } from "../lib/supabase";
import { ref } from "vue";

// Singleton user, shared across all imports
import { onMounted } from "vue";
const user = ref(null);

// Listen to auth state changes (login/logout)
supabase.auth.onAuthStateChange((event, session) => {
  user.value = session?.user || null;
});

export function useAuth() {
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) console.error(error);
    // user akan diupdate otomatis oleh onAuthStateChange
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    // user akan diupdate otomatis oleh onAuthStateChange
  };

  const getUser = async () => {
    // Cek user dari session jika belum ada
    if (!user.value) {
      const { data } = await supabase.auth.getUser();
      user.value = data.user;
    }
    return user.value;
  };

  return { loginWithGoogle, logout, getUser, user };
}
