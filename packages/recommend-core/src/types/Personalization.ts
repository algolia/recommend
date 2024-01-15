export type Personalization = {
  userToken?: string;
  region?: 'us' | 'eu';
  personalizationCache?: {
    profileMs?: number;
    strategyMs?: number;
  };
};
