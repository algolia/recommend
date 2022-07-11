import { Pragma } from '@algolia/recommend-vdom';

import { ProductHit } from '../types/ProductHit';

export function relatedItem(item: ProductHit, createElement: Pragma) {
  return createElement('div', { className: 'relative' }, [
    createElement('img', {
      className: 'max-w-full',
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
        { className: 'text-gray-900 font-semibold mb-1 whitespace-normal' },
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
