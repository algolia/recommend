export const forceDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
