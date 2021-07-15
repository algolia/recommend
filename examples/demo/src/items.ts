export type ProductHit = {
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

export const items: ProductHit[] = [
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
