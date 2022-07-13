import { Pragma } from '@algolia/recommend-vdom';

import { ProductHit } from '../types/ProductHit';

interface RelatedItemProps {
  item: ProductHit;
  createElement: Pragma;
}

export function relatedItem({ item, createElement }: RelatedItemProps) {
  return createElement('div', { className: 'relative' }, [
    createElement('img', {
      className: 'max-h-80',
      src: item.image_urls?.[0],
    }),
    createElement('div', { className: 'RelatedItem-info' }, [
      createElement(
        'div',
        {
          className:
            'flex items-center absolute right-0 bottom-0 text-gray-500 font-semibold text-xs rounded-lg m-2 py-1 px-2',
          style: { background: 'rgb(255 255 255 / 92%)' },
        },
        item.objectID
      ),
    ]),
    createElement('div', null, [
      createElement('div', { className: 'text-sm text-gray-500' }, item.brand),
      createElement(
        'div',
        { className: 'text-gray-900 font-semibold mb-1 truncate' },
        item.name
      ),
    ]),
    createElement(
      'button',
      {
        className:
          'flex items-center justify-center w-full bg-white border-nebula-500 border-solid border rounded text-nebula-900 cursor-pointer py-1 px-2 font-semibold',
      },
      'Add to cart'
    ),
  ]);
}
