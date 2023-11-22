import { ProductRecord } from '../../types';

export type PersonalisationAffinities = {
  userToken: string;
  logRegion: string;
  appID: string;
  apiKey: string;
};

export type PersonaliseRecommendations<TObject> = {
  hits: Array<ProductRecord<ProductRecord<TObject>>>;
} & PersonalisationAffinities;

export type AffinitiesResponse = {
  userToken: string;
  lastEventAt: string;
  scores: Record<string, Record<string, number>>;
};
