import React from 'react';

import { ProductBaseRecord, RecommendationTranslations } from './types';
import {
  useRecommendations,
  UseRecommendationsProps,
} from './useRecommendations';

export type RecommendationsProps<TObject> = UseRecommendationsProps & {
  hitComponent: React.FunctionComponent<{ hit: TObject }>;
  children?(props: {
    recommendations: TObject[];
    children: JSX.Element;
  }): JSX.Element;
  translations?: Partial<RecommendationTranslations>;
};

function defaultRender<TObject>(props: {
  recommendations: TObject[];
  children: JSX.Element;
}) {
  return props.children;
}

/**
 * @deprecated
 */
export function Recommendations<TObject extends ProductBaseRecord>(
  props: RecommendationsProps<TObject>
) {
  const { recommendations } = useRecommendations<TObject>(props);
  const render = props.children || defaultRender;

  const children = (
    <div className="auc-Recommendations">
      {recommendations.length > 0 && (
        <ol className="auc-Recommendations-list">
          {recommendations.map((recommendation) => (
            <li
              key={recommendation.objectID}
              className="auc-Recommendations-item"
            >
              <props.hitComponent hit={recommendation} />
            </li>
          ))}
        </ol>
      )}
    </div>
  );

  return render({ recommendations, children });
}
