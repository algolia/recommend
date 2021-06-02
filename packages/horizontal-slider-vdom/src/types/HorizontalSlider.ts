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
  sliderLabel: string;
  previousButtonLabel: string;
  previousButtonTitle: string;
  nextButtonLabel: string;
  nextButtonTitle: string;
}>;

export type HorizontalSliderProps<TItem extends RecordWithObjectID> = {
  items: TItem[];
  itemComponent({ item: TItem }): JSX.Element;
  classNames?: HorizontalSliderClassnames;
  translations?: HorizontalSliderTranslations;
};
