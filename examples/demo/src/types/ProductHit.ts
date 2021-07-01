import { Hit } from '@algolia/client-search';

export type ProductRecord = {
  category: string;
  image_link: string;
  hierarchical_categories: {
    lvl0: string;
    lvl1?: string;
    lvl2?: string;
    lvl3?: string;
    lvl4?: string;
    lvl5?: string;
  };
  name: string;
  price: number;
  url: string;
};

type WithInsights<THit> = THit & {
  __position: string;
  __indexName: string;
  __queryID: string;
};

export type ProductHit = WithInsights<Hit<ProductRecord>>;
