import algoliarecommend from '@algolia/recommend';
import { TrendingFacets } from '@algolia/recommend-react';
import React from 'react';

import { Facet } from '../components';
import { apiKey, appId } from '../config';
import { FacetHit } from '../types';

import { useApplicationContext } from './Root';

const indexName = 'index-that-does-not-exist';
const recommendClient = algoliarecommend(appId, apiKey);

export const ErrorPage: React.FC = () => {
  const [
    { insights, selectedFacetValue, setSelectedFacetValue },
  ] = useApplicationContext();

  return (
    <div>
      <h1>Should throw an error</h1>
      <TrendingFacets<FacetHit>
        recommendClient={recommendClient}
        indexName={indexName}
        facetName="brand"
        itemComponent={({ item }) => (
          <Facet
            hit={item}
            insights={insights}
            onSelect={(facetHits) => {
              const isSameValue =
                selectedFacetValue &&
                facetHits.facetValue === selectedFacetValue.facetValue;
              setSelectedFacetValue(isSameValue ? null : facetHits);
            }}
            indexName={indexName}
          />
        )}
        maxRecommendations={5}
        translations={{
          title: 'Trending Facet (brand)',
        }}
      />
    </div>
  );
};
