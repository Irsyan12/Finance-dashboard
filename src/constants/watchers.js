import { watch } from "vue";

/**
 * Watch user and fetch data when user is available and logged in
 * @param {Object} user - User reactive reference
 * @param {Object} isLoggedIn - Is logged in reactive reference
 * @param {Function[]} fetchFunctions - Array of functions to call when user is available
 * @returns {Function} - Stop watcher function
 */
export const watchUserAndFetch = (user, isLoggedIn, fetchFunctions = []) => {
  return watch(
    () => user.value,
    (newUser) => {
      if (newUser && isLoggedIn.value) {
        fetchFunctions.forEach((fn) => {
          if (typeof fn === "function") {
            fn();
          }
        });
      }
    },
    { immediate: true }
  );
};

/**
 * Common watcher for fetching categories when user is available
 * @param {Object} user - User reactive reference
 * @param {Object} isLoggedIn - Is logged in reactive reference
 * @param {Function} fetchCategories - Fetch categories function
 * @returns {Function} - Stop watcher function
 */
export const watchUserAndFetchCategories = (
  user,
  isLoggedIn,
  fetchCategories
) => {
  return watchUserAndFetch(user, isLoggedIn, [fetchCategories]);
};

/**
 * Common watcher for fetching transactions when user is available
 * @param {Object} user - User reactive reference
 * @param {Object} isLoggedIn - Is logged in reactive reference
 * @param {Function} fetchTransactions - Fetch transactions function
 * @returns {Function} - Stop watcher function
 */
export const watchUserAndFetchTransactions = (
  user,
  isLoggedIn,
  fetchTransactions
) => {
  return watchUserAndFetch(user, isLoggedIn, [fetchTransactions]);
};

/**
 * Common watcher for fetching both categories and transactions when user is available
 * @param {Object} user - User reactive reference
 * @param {Object} isLoggedIn - Is logged in reactive reference
 * @param {Function} fetchCategories - Fetch categories function
 * @param {Function} fetchTransactions - Fetch transactions function
 * @returns {Function} - Stop watcher function
 */
export const watchUserAndFetchAll = (
  user,
  isLoggedIn,
  fetchCategories,
  fetchTransactions
) => {
  return watchUserAndFetch(user, isLoggedIn, [
    fetchCategories,
    fetchTransactions,
  ]);
};
