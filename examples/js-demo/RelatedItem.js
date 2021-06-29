/** @jsx h */
import { h } from 'preact';

export function RelatedItem({ item, insights, onSelect }) {
  return (
    <a
      className="flex flex-col h-full gap-2 no-underline"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();

        // eslint-disable-next-line no-console
        console.log(item.objectID);

        onSelect(item);

        insights('clickedObjectIDs', {
          objectIDs: [item.objectID],
          positions: [item.__position],
          eventName: 'Product Clicked',
          queryID: item.__queryID,
          index: item.__indexName,
        });
      }}
    >
      <div className="relative">
        <img src={item.image_link} alt={item.name} className="max-w-full" />

        <div className="RelatedItem-info">
          {item._score && (
            <div
              className="flex items-center absolute right-0 top-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
              style={{ background: 'rgb(255 255 255 / 92%)' }}
            >
              <svg className="inline-block mr-1" width="18" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M18.984 9.984h2.016v4.031h-2.016v-4.031zM15 18v-12h2.016v12h-2.016zM3 14.016v-4.031h2.016v4.031h-2.016zM11.016 21.984v-19.969h1.969v19.969h-1.969zM6.984 18v-12h2.016v12h-2.016z"
                ></path>
              </svg>
              {item._score}
            </div>
          )}
          <div
            className="flex items-center absolute right-0 bottom-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2"
            style={{ background: 'rgb(255 255 255 / 92%)' }}
          >
            {item.objectID}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-grow gap-2">
        <div className="text-sm text-gray-500">{item.category}</div>

        <div className="leading-tight flex-grow">{item.name}</div>

        {Boolean(item.reviewScore) && (
          <div className="flex flex-grow items-center text-sm text-gray-700">
            <svg
              className="mr-1 text-yellow-500"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="mr-1">{item.reviewScore.toFixed(1) || '--'}</span>
            <span className="text-gray-400">({item.reviewCount} reviews)</span>
          </div>
        )}

        <div className="my-2 font-semibold text-gray-800">${item.price}</div>

        <button
          className="flex items-center justify-center w-full bg-white border-indigo-500 border-solid border rounded text-indigo-700 cursor-pointer py-1 px-2 font-semibold"
          onClick={(event) => {
            event.preventDefault();

            insights('convertedObjectIDsAfterSearch', {
              objectIDs: [item.objectID],
              eventName: 'Product Added To Cart',
              queryID: item.__queryID,
              index: item.__indexName,
            });
          }}
        >
          Add to cart
        </button>
      </div>
    </a>
  );
}
