import { supabase } from "../supabase/supabase";
import { ref } from "vue";
import { useUserInitialization } from "./useUserInitialization";

import { onMounted } from "vue";
const user = ref(null);
const { initializeNewUser } = useUserInitialization();

// Listen to auth state changes (login/logout)
supabase.auth.onAuthStateChange(async (event, session) => {
  const newUser = session?.user || null;

  // If user just logged in and it's a new user
  if (event === "SIGNED_IN" && newUser && !user.value) {

    // Initialize user data in background (non-blocking)
    initializeNewUser(newUser.id).catch((error) => {
      console.error("Background user initialization failed:", error);
    });
  }

  user.value = newUser;
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
