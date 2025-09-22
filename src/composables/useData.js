import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

// Composable untuk data user (bukan untuk auth actions)
export const useUserData = () => {
  const auth = useAuthStore();

  // Auto fetch user data saat composable dipanggil
  auth.fetchUser();

  const userData = computed(
    () => auth.user?.raw_user_meta_data || auth.user?.user_metadata || null
  );
  const user = computed(() => auth.user);
  const isLoggedIn = computed(() => !!auth.user);

  return {
    userData,
    user,
    isLoggedIn,
  };
};

// Export untuk backward compatibility
export const userDataComposable = computed(() => {
  const auth = useAuthStore();
  auth.fetchUser();
  return auth.user?.user_metadata;
});
