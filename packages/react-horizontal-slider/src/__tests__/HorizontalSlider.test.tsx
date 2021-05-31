import { render, waitFor } from '@testing-library/react';
import React from 'react';

import { HorizontalSlider } from '../HorizontalSlider';

const items = [
  { objectID: '1', name: '1' },
  { objectID: '2', name: '2' },
];

describe('HorizontalSlider', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('render with default props', async () => {
    render(
      <HorizontalSlider
        items={items}
        itemComponent={({ item }) => <div>{item.name}</div>}
      />
    );

    await waitFor(() => {
      expect(
        document.querySelector('.uic-HorizontalSlider-container')
      ).toBeInTheDocument();
    });
  });

  test('pass `createElement` and `Fragment` to itemComponent', async () => {
    render(
      <HorizontalSlider
        items={items}
        itemComponent={({ item, createElement, Fragment }) => {
          expect(createElement).toBe(React.createElement);
          expect(Fragment).toBe(React.Fragment);

          return createElement('div', {}, item.name);
        }}
      />
    );

    await waitFor(() => {
      expect(
        document.querySelector('.uic-HorizontalSlider-container')
      ).toBeInTheDocument();
    });
  });
});
