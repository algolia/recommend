import { getHitsFromResponse } from '../getHitsFromResponse';

/* eslint-disable @typescript-eslint/camelcase */
const response = {
  results: [
    {
      exhaustiveNbHits: true,
      exhaustiveTypo: true,
      hits: [
        {
          brand: 'Who are you?',
          category_page_id: ['Women > Clothing', 'Women > Clothing > T-shirts'],
          color: {
            filter_group: 'gold;#FCDC00',
            original_name: 'gold',
          },
          gender: 'women',
          list_categories: ['Women', 'Clothing', 'T-shirts'],
          name: 'T-Shirt Ki 6? Who are you? gold',
          objectID: '1-1',
          _score: 100,
        },
        {
          brand: 'Zanellato',
          category_page_id: ['Men > Clothing', 'Men > Clothing > T-shirts'],
          color: {
            filter_group: 'gold;#FCDC00',
            original_name: 'gold',
          },
          gender: 'men',
          list_categories: ['Men', 'Clothing', 'T-shirts'],
          name: 'T-Shirt Ki 6? Zanellato? gold',
          objectID: '1-2',
          _score: 98,
        },
        {
          brand: 'Hogan',
          category_page_id: ['Women > Shoes', 'Women > Shoes > Sneakers'],
          color: {
            filter_group: 'gold;#FCDC00',
            original_name: 'rose',
          },
          gender: 'women',
          list_categories: ['Women', 'Shoes', 'Sneakers'],
          name: 'Sneakers ”H222” Hogan pink',
          objectID: '1-3',
          _score: 98,
        },
      ],
      hitsPerPage: 10,
      nbHits: 10,
      nbPages: 1,
      page: 0,
      processingTimeMS: 2,
      query: '',
      params: '',
    },
  ],
};
/* eslint-enable @typescript-eslint/camelcase */

describe('getHitsfromResponse', () => {
  test('retrieves array of hits from response', () => {
    const result = getHitsFromResponse(response);

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "_score": 100,
          "brand": "Who are you?",
          "category_page_id": Array [
            "Women > Clothing",
            "Women > Clothing > T-shirts",
          ],
          "color": Object {
            "filter_group": "gold;#FCDC00",
            "original_name": "gold",
          },
          "gender": "women",
          "list_categories": Array [
            "Women",
            "Clothing",
            "T-shirts",
          ],
          "name": "T-Shirt Ki 6? Who are you? gold",
          "objectID": "1-1",
        },
        Object {
          "_score": 98,
          "brand": "Zanellato",
          "category_page_id": Array [
            "Men > Clothing",
            "Men > Clothing > T-shirts",
          ],
          "color": Object {
            "filter_group": "gold;#FCDC00",
            "original_name": "gold",
          },
          "gender": "men",
          "list_categories": Array [
            "Men",
            "Clothing",
            "T-shirts",
          ],
          "name": "T-Shirt Ki 6? Zanellato? gold",
          "objectID": "1-2",
        },
        Object {
          "_score": 98,
          "brand": "Hogan",
          "category_page_id": Array [
            "Women > Shoes",
            "Women > Shoes > Sneakers",
          ],
          "color": Object {
            "filter_group": "gold;#FCDC00",
            "original_name": "rose",
          },
          "gender": "women",
          "list_categories": Array [
            "Women",
            "Shoes",
            "Sneakers",
          ],
          "name": "Sneakers ”H222” Hogan pink",
          "objectID": "1-3",
        },
      ]
    `);
  });
});
