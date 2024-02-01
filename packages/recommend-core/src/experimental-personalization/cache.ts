type Params = {
  userToken?: string;
  region: string;
  apiKey: string;
  appId: string;
};

const getElapsedTimeMS = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  return now.getTime() - created.getTime();
};

/**
 * Retrieves value from cache.
 *
 * @function getCachedValue
 * @param {Object} params - An object used as the key to retrieve the cached value from sessionStorage.
 * @param {number} [ttl=60000] - The time-to-live (TTL) of the cache in milliseconds. The default value is 60000 ms (1 minute). If the cached value is older than the TTL, it's considered expired and the function returns null.
 * @returns {any} The value retrieved from the cache. If the key does not exist, returns null. If any error occurs during the process, the function also returns null.
 */
export const getCachedValue = (params: Params, ttl: number = 60000): any => {
  try {
    if (!window || !window.sessionStorage) {
      return null;
    }

    const cached = sessionStorage.getItem(JSON.stringify(params));

    if (cached) {
      const obj = JSON.parse(cached);
      const createdSince = getElapsedTimeMS(obj._createdAt);
      if (createdSince !== null && createdSince <= ttl) {
        return obj;
      }
    }
  } catch {
    return null;
  }

  return null;
};

/**
 * Stores a value in the cache.
 *
 * @function setCachedValue
 * @param {Object} params - An object used as the key to store the value in sessionStorage.
 * @param {unknown} value - The value to be stored in the sessionStorage.
 * @returns {void}
 */
export const setCachedValue = (params: Params, value: unknown): void => {
  try {
    if (
      !window ||
      !window.sessionStorage ||
      typeof params !== 'object' ||
      typeof value !== 'object'
    ) {
      return;
    }

    const key = JSON.stringify(params);

    sessionStorage.setItem(
      key,
      JSON.stringify({ ...value, _createdAt: new Date() })
    );
  } catch {
    return;
  }
};
