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
      </div>
    </a>
  );
};
