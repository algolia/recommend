const getElapsedTime = (createdAt: string) => {
  if (!createdAt) {
    return null;
  }

  const minutes = Math.floor(
    Math.abs(new Date().valueOf() - Date.parse(createdAt).valueOf()) / 1000 / 60
  );

  return minutes;
};

export const getCachedValue = (params: any, ttl = 10) => {
  try {
    if (!window || !window.sessionStorage) {
      return null;
    }

    const cached = sessionStorage.getItem(JSON.stringify(params));

    if (cached) {
      const obj = JSON.parse(cached);
      const createdAt = getElapsedTime(obj._createdAt);
      if (createdAt !== null && createdAt < ttl) {
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
