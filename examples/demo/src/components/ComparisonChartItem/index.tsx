import React from 'react';
import './style.css';
import { InsightsClient } from 'search-insights';

import { indexName } from '../../config';
import { ProductHit, ProductReviews } from '../../types';
import { ButtonComponent } from '../common';

type ChartItemProps<TObject> = {
  item: TObject;
  insights: InsightsClient;
  onSelect(item: TObject): void;
};

type ChartItemReviews = {
  reviews: ProductReviews;
};

export const StarRating: React.FC<ChartItemReviews> = ({
  reviews,
}): JSX.Element => {
  const { rating, count } = reviews;

  return (
    <div className="uic-StarRating-container">
      <div>
        {[...Array(rating)].map((star, index) => (
          <span key={index} className="uic-StarRating-star">
            &#9733;
          </span>
        ))}
        {[...Array(5 - rating)].map((star, index) => (
          <span key={index} className="uic-StarRating-star">
            &#9734;
          </span>
        ))}
      </div>

      <div>({count})</div>
    </div>
  );
};

export const ComparisonChartItem: React.FC<ChartItemProps<ProductHit>> = ({
  item,
  onSelect,
  insights,
}): JSX.Element => {
  const userToken = React.useRef<any>('');
  insights('getUserToken', {}, (_err, token) => (userToken.current = token));

  const personalization = item?._rankingInfo?.personalization ?? {
    initialPosition: 0,
    newPosition: 0,
    filtersScore: 0,
  };
  const isPersonalized = personalization.filtersScore > 0;

  return (
    <div className="uic-ComparisonChart-itemContainer">
      <div className="uic-ComparisonChart-itemHeading">
        <a
          className="Hit Item-link"
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
          <div className="uic-ComparisonChart-itemImageContainer">
            <img
              className="uic-ComparisonChart-itemImage"
              src={item.image_urls[0]}
              alt={item.name}
            />
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
          <div className="uic-ButtonComponent-container">
            <ButtonComponent
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                insights('convertedObjectIDsAfterSearch', {
                  userToken: userToken.current,
                  eventName: 'Product Added To Cart',
                  objectIDs: [item.objectID],
                  index: indexName,
                  queryID: item.__queryID,
                });
              }}
              label="Add to cart"
            />
          </div>
        </a>
      </div>
      <div className="uic-ComparisonChart-item">{item.name}</div>
      <div className="uic-ComparisonChart-item">{item.brand}</div>
      <div className="uic-ComparisonChart-item">${item.price.value}</div>
      <div className="uic-ComparisonChart-item">{item.gender}</div>
      <div className="uic-ComparisonChart-item">{item.color.original_name}</div>
      <div className="uic-ComparisonChart-item">
        <StarRating reviews={item.reviews} />
      </div>
    </div>
  );
};
