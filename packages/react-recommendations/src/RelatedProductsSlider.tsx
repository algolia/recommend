import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';

import { RelatedProductsProps } from './RelatedProducts';
import { ProductBaseRecord, RecommendationTranslations } from './types';
import { useRelatedProducts } from './useRelatedProducts';

let lastSliderId = 0;

function generatedSliderId() {
  return `auc-slider-${lastSliderId++}`;
}

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: React.ReactNode;
}) {
  if (props.recommendations.length === 0) {
    return null;
  }

  return props.children;
}

export function RelatedProductsSlider<TObject extends ProductBaseRecord>(
  props: RelatedProductsProps<TObject>
) {
  const { recommendations } = useRelatedProducts<TObject>(props);
  const render = props.children || defaultRender;
  const translations: RecommendationTranslations = useMemo(
    () => ({
      title: 'Related products',
      showMore: 'Show more',
      ...props.translations,
    }),
    [props.translations]
  );
  const listRef = useRef<HTMLOListElement>(null);
  const previousButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const sliderIdRef = useRef(generatedSliderId());

  const isPreviousButtonHidden = () =>
    Boolean(!listRef.current || listRef.current.scrollLeft <= 0);
  const isNextButtonHidden = () =>
    Boolean(
      !listRef.current ||
        listRef.current.scrollLeft + listRef.current.clientWidth >=
          listRef.current.scrollWidth
    );

  function scrollLeft() {
    if (listRef.current) {
      listRef.current.scrollLeft -= listRef.current.offsetWidth * 0.75;
    }
  }

  function scrollRight() {
    if (listRef.current) {
      listRef.current.scrollLeft += listRef.current.offsetWidth * 0.75;
    }
  }

  const children = (
    <section className="auc-Recommendations auc-Recommendations--inline">
      {translations.title && <h3>{translations.title}</h3>}

      {recommendations.length > 0 && (
        <div className="auc-Recommendations-container">
          <button
            ref={previousButtonRef}
            aria-label="Previous"
            aria-controls={sliderIdRef.current}
            hidden={isPreviousButtonHidden()}
            className="auc-Recommendations-navigation auc-Recommendations-navigation--previous"
            onClick={(event) => {
              event.preventDefault();
              scrollLeft();
            }}
          >
            <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.13809 0.744078C7.39844 1.06951 7.39844 1.59715 7.13809 1.92259L2.27616 8L7.13809 14.0774C7.39844 14.4028 7.39844 14.9305 7.13809 15.2559C6.87774 15.5814 6.45563 15.5814 6.19528 15.2559L0.861949 8.58926C0.6016 8.26382 0.6016 7.73618 0.861949 7.41074L6.19528 0.744078C6.45563 0.418641 6.87774 0.418641 7.13809 0.744078Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <ol
            className="auc-Recommendations-list"
            ref={listRef}
            tabIndex={0}
            id={sliderIdRef.current}
            aria-roledescription="carousel"
            aria-label={translations.title}
            aria-live="polite"
            onScroll={() => {
              if (
                !listRef.current ||
                !previousButtonRef.current ||
                !nextButtonRef.current
              ) {
                return;
              }

              previousButtonRef.current.hidden = isPreviousButtonHidden();
              nextButtonRef.current.hidden = isNextButtonHidden();
            }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault();
                scrollLeft();
              } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                scrollRight();
              }
            }}
          >
            {recommendations.map((recommendation, index) => (
              <li
                key={recommendation.objectID}
                className="auc-Recommendations-item"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${recommendations.length}`}
              >
                <props.hitComponent hit={recommendation} />
              </li>
            ))}
          </ol>

          <button
            ref={nextButtonRef}
            aria-label="Next"
            aria-controls={sliderIdRef.current}
            hidden={isNextButtonHidden()}
            className="auc-Recommendations-navigation auc-Recommendations-navigation--next"
            onClick={(event) => {
              event.preventDefault();
              scrollRight();
            }}
          >
            <svg width="8" height="16" viewBox="0 0 8 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.861908 15.2559C0.601559 14.9305 0.601559 14.4028 0.861908 14.0774L5.72384 8L0.861908 1.92259C0.601559 1.59715 0.601559 1.06952 0.861908 0.744079C1.12226 0.418642 1.54437 0.418642 1.80472 0.744079L7.13805 7.41074C7.3984 7.73618 7.3984 8.26382 7.13805 8.58926L1.80472 15.2559C1.54437 15.5814 1.12226 15.5814 0.861908 15.2559Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  );

  return render({ recommendations, children });
}

RelatedProductsSlider.propTypes = {
  searchClient: PropTypes.object.isRequired,
  indexName: PropTypes.string.isRequired,
  objectID: PropTypes.string.isRequired,
  hitComponent: PropTypes.elementType.isRequired,

  fallbackFilters: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
  ),
  maxRecommendations: PropTypes.number,
  searchParameters: PropTypes.object,
  threshold: PropTypes.number,

  children: PropTypes.func,
};
