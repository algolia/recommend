import { ProductHit } from './ProductHit';

export type BundleViewTranslations = Partial<{
  totalPrice: string;
  thisArticle: string;
  addToCart(count: number): string;
}>;

export type BundleViewProps = {
  currentItem: ProductHit;
  formatPrice?: (price: number) => string;
  getAmount?(items: ProductHit[]): number;
  itemComponent({ item: ProductHit }): JSX.Element;
  items: ProductHit[];
  translations?: BundleViewTranslations;
};
