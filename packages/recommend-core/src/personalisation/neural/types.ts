type Affinity = {
  name: string;
  indices: string[];
  value: string;
  score: number;
  lastUpdatedAt: string;
};

export type UserProfileResponse = {
  userID: string;
  affinities: Affinity[];
  lastUpdatedAt: string;
};
