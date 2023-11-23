import React, { useEffect } from 'react';
import { InsightsClient } from 'search-insights';

import { indexName } from '../../config';
import { ProductHit } from '../../types';
import { ButtonComponent } from '../common';
import './style.css';

type HitProps = {
  hit: ProductHit;
  insights: InsightsClient;
  onSelect(hit: ProductHit): void;
};

export function Hit({ hit, onSelect, insights }: HitProps) {
  const userToken = React.useRef<any>('');
  insights('getUserToken', {}, (_err, token) => (userToken.current = token));

  const personalization = hit?._rankingInfo?.personalization ?? {
    initialPosition: 0,
    newPosition: 0,
    filtersScore: 0,
  };
  const isPersonalized = personalization.filtersScore > 0;

  useEffect(() => {
    insights('viewedObjectIDs', {
      eventName: 'Product Viewed',
      userToken: userToken.current,
      objectIDs: [hit.objectID],
      index: indexName,
    });
  }, [hit.objectID, insights]);

  return (
    <a
      className="Hit Hit-link"
      href={hit.url}
      onClick={(event) => {
        event.preventDefault();

        onSelect(hit);
        insights('clickedObjectIDs', {
          userToken: userToken.current,
          objectIDs: [hit.objectID],
          eventName: 'Product Clicked',
          index: indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={hit.image_urls[0]} alt={hit.name} className="product-image" />
        {isPersonalized && (
          <svg
            fill="none"
            stroke="#5468ff"
            viewBox="0 0 24 24"
            className="Personalized-Badge"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        )}
      </div>

      <div className="Hit-Content">
        <div className="Hit-Name">{hit.name}</div>
        <div className="Hit-Description">{hit.objectID}</div>

        <div className="Hit-Price">${hit.price.value}</div>
        <ButtonComponent
          label="Add to cart"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            insights('convertedObjectIDsAfterSearch', {
              userToken: userToken.current,
              eventName: 'Product Added To Cart',
              objectIDs: [hit.objectID],
              index: indexName,
              queryID: hit.__queryID,
            });
          }}
        />
      </div>
    </a>
  );
}
