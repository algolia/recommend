const defaultConfig = {
  appId: 'HYDY1KWTWB',
  apiKey: '28cf6d38411215e2eef188e635216508',
  indexName: 'gstar_demo_test',
  nameAttribute: 'name',
  categoryAttribute: 'category',
  priceAttribute: 'price',
  imageAttribute: 'image_link',
  fallbackFilter: 'category',
};

const config = {
  ...defaultConfig,
  appId: process.env.DEMO_APP_ID,
  apiKey: process.env.DEMO_API_KEY,
  indexName: process.env.DEMO_INDEX_NAME,
  nameAttribute: process.env.DEMO_ATTRIBUTE_NAME,
  imageAttribute: process.env.DEMO_ATTRIBUTE_IMAGE,
  categoryAttribute: process.env.DEMO_ATTRIBUTE_CATEGORY,
  priceAttribute: process.env.DEMO_ATTRIBUTE_PRICE,
  fallbackFilter: process.env.DEMO_FALLBACK_FILTER,
};

export default config;
