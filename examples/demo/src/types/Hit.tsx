import { ProductHit } from './ProductHit';

export type HitProps = {
  hit: ProductHit;
  onSelect(hit: ProductHit): void;
};
