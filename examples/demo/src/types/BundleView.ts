export type BaseObject = {
  objectID: string;
  name: string;
  price: number;
};

export type BundleViewTranslations = Partial<{
  totalPrice: string;
  thisArticle: string;
  addToCart(count: number): string;
}>;

export type BundleViewProps<TObject> = {
  currentItem: TObject;
  formatPrice?: (price: number) => string;
  getAmount?(items: TObject[]): number;
  itemComponent({ item: TObject }): JSX.Element;
  items: TObject[];
  translations?: BundleViewTranslations;
};
