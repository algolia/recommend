import { ProductHit } from './ProductHit';

export type RelatedItemProps = {
  item: ProductHit;
  onSelect(hit: ProductHit): void;
};
