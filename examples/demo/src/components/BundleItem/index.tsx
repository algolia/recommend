import React from 'react';
import { InsightsClient } from 'search-insights';

import { indexName } from '../../config';
import { ProductHit } from '../../types';

type BundleItemProps<TObject> = {
  item: TObject;
  onSelect(item: TObject): void;
  insights: InsightsClient;
};

export const BundleItem: React.FC<BundleItemProps<ProductHit>> = ({
  item,
  onSelect,
  insights,
}) => {
  const userToken = React.useRef<any>('');
  insights('getUserToken', {}, (_err, token) => (userToken.current = token));

  const personalization = item?._rankingInfo?.personalization ?? {
    initialPosition: 0,
    newPosition: 0,
    filtersScore: 0,
  };
  const isPersonalized = personalization.filtersScore > 0;

  return (
    <a
      className="Hit Hit-link"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();

        onSelect(item);
        insights('clickedObjectIDs', {
          userToken: userToken.current,
          objectIDs: [item.objectID],
          eventName: 'Product Clicked',
          index: indexName,
        });
      }}
    >
      <div className="Hit-Image">
        <img src={item.image_urls[0]} alt={item.name} />
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
    </a>
  );
};
