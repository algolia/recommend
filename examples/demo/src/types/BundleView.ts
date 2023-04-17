export type BaseObject = {
  objectID: string;
  name: string;
  price: { value: number };
};

export type BundleViewTranslations = Partial<{
  totalPrice: string;
  thisArticle: string;
  addToCart: (count: number) => string;
}>;

export type BundleViewProps<TObject> = {
  currentItem: TObject;
  formatPrice?: (price: number) => string;
  getAmount?: (items: TObject[]) => number;
  itemComponent: ({ item }) => JSX.Element;
  items: TObject[];
  translations?: BundleViewTranslations;
};
