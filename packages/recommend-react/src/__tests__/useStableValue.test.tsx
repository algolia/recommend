import { render } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';

import { useStableValue } from '../useStableValue';

type ComponentProps = {
  query: string;
  fn: (value: number) => number;
  IDs: string[];
};

const Component = ({ props }: { props: ComponentProps }) => {
  const lastProps = useStableValue(props);

  return (
    <div>
      <span>{lastProps.query}</span>
      <span>{lastProps.fn(42)}</span>
      <span>{lastProps.IDs.join(', ')}</span>
    </div>
  );
};

describe('useStableValue', () => {
  test('rerender when the props changes', () => {
    const firstRender = render(
      <Component
        props={{
          query: 'first query',
          fn: (value) => value,
          IDs: ['1', '2', '3'],
        }}
      />
    );

    expect(firstRender.getByText('first query')).toBeInTheDocument();
    expect(firstRender.getByText('42')).toBeInTheDocument();
    expect(firstRender.getByText('1, 2, 3')).toBeInTheDocument();

    firstRender.rerender(
      <Component
        props={{
          query: 'second query',
          fn: (value) => value + 1,
          IDs: ['1', '2', '3', '4'],
        }}
      />
    );

    expect(firstRender.getByText('second query')).toBeInTheDocument();
    expect(firstRender.getByText('43')).toBeInTheDocument();
    expect(firstRender.getByText('1, 2, 3, 4')).toBeInTheDocument();
  });
});
