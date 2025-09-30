import { ref, computed } from "vue";

// Global cache storage
const cache = {
  transactions: ref(null),
  categories: ref(null),
  lastFetch: ref({
    transactions: null,
    categories: null,
  }),
  userCache: ref(new Map()), // Cache per user
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useDataCache = () => {
  const isDataFresh = (key, userId) => {
    const lastFetch = cache.lastFetch.value[key];
    const userLastFetch = cache.userCache.value.get(`${userId}_${key}`);

    if (!lastFetch && !userLastFetch) return false;

    const timestamp = userLastFetch || lastFetch;
    return Date.now() - timestamp < CACHE_DURATION;
  };

  const getCachedData = (key, userId) => {
    if (isDataFresh(key, userId)) {
      return cache[key].value;
    }
    return null;
  };

  const setCachedData = (key, data, userId) => {
    cache[key].value = data;
    cache.lastFetch.value[key] = Date.now();

    // Cache per user
    if (userId) {
      cache.userCache.value.set(`${userId}_${key}`, Date.now());
    }
  };

  const clearCache = (key = null) => {
    if (key) {
      cache[key].value = null;
      cache.lastFetch.value[key] = null;
    } else {
      Object.keys(cache).forEach((k) => {
        if (k !== "userCache") {
          cache[k].value = null;
        }
      });
      cache.lastFetch.value = {};
      cache.userCache.value.clear();
    }
  };

  const getCacheInfo = () => {
    return {
      transactions: {
        hasData: !!cache.transactions.value,
        lastFetch: cache.lastFetch.value.transactions,
        isFresh: cache.lastFetch.value.transactions
          ? Date.now() - cache.lastFetch.value.transactions < CACHE_DURATION
          : false,
      },
      categories: {
        hasData: !!cache.categories.value,
        lastFetch: cache.lastFetch.value.categories,
        isFresh: cache.lastFetch.value.categories
          ? Date.now() - cache.lastFetch.value.categories < CACHE_DURATION
          : false,
      },
    };
  };

  return {
    getCachedData,
    setCachedData,
    isDataFresh,
    clearCache,
    getCacheInfo,
    cache: computed(() => cache),
    CACHE_DURATION,
  };
};
