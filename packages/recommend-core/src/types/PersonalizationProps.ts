export type PersonalizationProps = {
  userToken: string;
  region: 'us' | 'eu';
  personalizationCache?: {
    profileMs?: number;
    strategyMs?: number;
  };
};
