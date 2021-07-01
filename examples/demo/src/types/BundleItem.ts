import { ProductHit } from './ProductHit';

export type BundleItemProps = {
  item: ProductHit;
  onSelect(item: ProductHit): void;
};
