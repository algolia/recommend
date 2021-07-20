import { renderHook } from '@testing-library/react-hooks';

import { useSafeEffect } from '../useSafeEffect';

describe('useSafeEffect', () => {
  test('executes callback', () => {
    const cb = jest.fn();

    renderHook(() => {
      useSafeEffect(() => {
        cb();
      }, {});
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  test('returns props to the callback', () => {
    const cb = jest.fn();
    const props = { a: 'b' };

    renderHook(() => {
      useSafeEffect((updatedProps) => {
        cb();
        expect(props).toEqual(updatedProps);
      }, props);
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  test('accepts altered props', () => {
    const cb = jest.fn();
    const props = { a: 'b' };

    renderHook(() => {
      useSafeEffect(
        (updatedProps) => {
          cb();
          expect(props).not.toEqual(updatedProps);
          expect(updatedProps).toEqual({ a: 0 });
        },
        props,
        {
          a: 0,
        }
      );
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });

  test('runs once when inlining non-primitive props', () => {
    const cb = jest.fn();

    renderHook(() => {
      useSafeEffect(
        () => {
          cb();
        },
        { objectIDs: ['test', 'test1'], a: { b: 'c' } }
      );
    });

    expect(cb).toHaveBeenCalledTimes(1);
  });
});
