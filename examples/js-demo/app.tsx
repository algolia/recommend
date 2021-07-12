/** @jsx h */
import { horizontalSlider } from '@algolia/ui-components-horizontal-slider-js';
import { h } from 'preact';

import '@algolia/ui-components-horizontal-slider-theme';

type ProductHit = {
  objectID: string;
  category: string;
  imageLink: string;
  name: string;
  price: number;
  _score: number;
  reviewScore: number;
  reviewCount: number;
  url: string;
};

const items: ProductHit[] = [
  {
    _score: 82.57,
    category: 'Women - Dark Denim',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/60883-D011-082-F01.jpg',
    name: 'Midge Cody Mid Skinny Jeans',
    objectID: '60883-D011-082',
    price: 190,
    reviewScore: 2,
    reviewCount: 300,
    url: 'women/jeans/60883-D011-082',
  },
  {
    _score: 79.67,
    category: 'Women - Jeans',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/D06333-9142-082-F01.jpg',
    name: 'Lynn D-Mid Waist Super Skinny Jeans',
    objectID: 'D06333-9142-082',
    price: 170,
    reviewCount: 25,
    reviewScore: 1,
    url: 'women/jeans/d06333-9142-082',
  },
  {
    _score: 79.47,
    category: 'Women - Jeans',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/D06193-4412-4947-F01.jpg',
    name: 'Motac 3D Mid Waist Skinny Jeans',
    objectID: 'D06193-4412-4947',
    price: 250,
    reviewCount: 87,
    reviewScore: 5,
    url: 'women/jeans/d06193-4412-4947',
  },
  {
    _score: 77.02,
    category: 'Women - Jeans',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/D06746-9518-8964-F01.jpg',
    name: 'Lynn Mid Waist Skinny Jeans',
    objectID: 'D06746-9518-8964',
    price: 170,
    reviewCount: 97,
    reviewScore: 3,
    url: 'women/jeans/d06746-9518-8964',
  },
  {
    _score: 76.03,
    category: 'Women - Jeans',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/D06314-8968-6028-F01.jpg',
    name: 'Lynn Mid Waist Skinny RP Ankle Jeans',
    objectID: 'D06314-8968-6028',
    price: 180,
    reviewCount: 14,
    reviewScore: 1,
    url: 'women/jeans/d06314-8968-6028',
  },
  {
    _score: 74.77,
    category: 'Women - Jeans',
    imageLink:
      'https://img1.g-star.com/image/private/c_fill,f_auto,h_540,q_80/D06194-8968-8960-F01.jpg',
    name: '5620 G-Star Elwood Staq 3D Mid Waist Skinny Jeans',
    objectID: 'D06194-8968-8960',
    price: 190,
    reviewCount: 53,
    reviewScore: 6,
    url: 'women/jeans/d06194-8968-8960',
  },
];

function RelatedItem({ item }: { item: ProductHit }) {
  return (
    <a
      className="RelatedItem grid gap-2 color-inherit no-underline"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      <div className="relative">
        <img src={item.imageLink} alt={item.name} className="max-w-full" />

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

      <div>
        <div className="text-sm text-gray-500">{item.category}</div>

        <div className="text-gray-900 font-semibold mb-1 whitespace-normal">
          {item.name}
        </div>

        {Boolean(item.reviewScore) && (
          <div className="items-center flex flex-grow text-sm text-gray-700">
            <svg
              className="mr-1 text-orange-500"
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
      </div>
    </a>
  );
}

horizontalSlider({
  container: '#relatedProducts',
  items,
  itemComponent: RelatedItem,
});
