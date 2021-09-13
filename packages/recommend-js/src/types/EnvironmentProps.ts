export type EnvironmentProps = {
  /**
   * The container for the component. You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). If there are several containers matching the selector, it picks up the first one.
   *
   * When `undefined`, the function returns a JSX element for you to inject wherever you want.
   *
   * @link https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/frequentlyBoughtTogether/#param-container
   */
  container?: string | HTMLElement;
  /**
   * The environment in which your application is running.
   *
   * This is useful if you're using Recommend in a different context than `window`.
   *
   * @default window
   * @link https://www.algolia.com/doc/ui-libraries/recommend/api-reference/recommend-js/frequentlyBoughtTogether/#param-environment
   */
  environment?: typeof window;
};
