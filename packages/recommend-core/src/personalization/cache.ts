const getElapsedTimeMS = (createdAt: string) => {
  const now = new Date();
  const created = new Date(createdAt);
  return now.getTime() - created.getTime();
};

export const getCachedValue = (params: any, ttl: number) => {
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

export const setCachedValue = (params: any, value: any) => {
  try {
    if (!window || !window.sessionStorage) {
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
