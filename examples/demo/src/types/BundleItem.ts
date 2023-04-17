export type BundleItemProps<TObject> = {
  item: TObject;
  onSelect: (item: TObject) => void;
};
