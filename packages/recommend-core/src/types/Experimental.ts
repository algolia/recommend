export type Experimental = {
  personalization?: {
    enabled: boolean;
    userToken: string;
    region: 'us' | 'eu';
    cache?: {
      profileMinutes?: number;
      strategyMinutes?: number;
    };
  };
};
