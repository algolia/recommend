export type AffinitiesResponse = {
  userToken: string;
  lastEventAt: string;
  scores: Record<string, Record<string, number>>;
};
