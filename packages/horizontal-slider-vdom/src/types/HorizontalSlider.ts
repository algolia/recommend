export type RecordWithObjectID<TObject = {}> = TObject & {
  objectID: string;
};

export type HorizontalSliderClassnames = Partial<{
  item: string;
  list: string;
  navigation: string;
  navigationNext: string;
  navigationPrevious: string;
  root: string;
}>;

export type HorizontalSliderTranslations = Partial<{
  nextButtonLabel: string;
  nextButtonTitle: string;
  previousButtonLabel: string;
  previousButtonTitle: string;
  sliderLabel: string;
}>;

export type HorizontalSliderProps<TItem extends RecordWithObjectID> = {
  classNames?: HorizontalSliderClassnames;
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
  translations?: HorizontalSliderTranslations;
};
