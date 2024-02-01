import { setCachedValue } from '../cache';

describe('cache', () => {
  describe('getCachedValue', () => {
    // to do
  });

  describe('setCachedValue', () => {
    it('sets value in sessionStorage', () => {
      const params = { region: 'eu', apiKey: 'key', appId: 'app_id' };
      const value = { c: 'd' };

      setCachedValue(params, value);

      const key = JSON.stringify(params);
      const storedValue = JSON.parse(sessionStorage.getItem(key) || '{}');

      expect(storedValue).toEqual({ ...value, _createdAt: expect.any(String) });
    });

    it('does not set value if params or value is not an object', () => {
      // @ts-expect-error Testing invalid params
      setCachedValue('', {});
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
      // @ts-expect-error Testing invalid params
      setCachedValue({}, 'string');
      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });

    it('does not set value if JSON.stringify throws an error', () => {
      const circularReference = { a: 'b' };
      // @ts-expect-error Testing circular reference
      circularReference.self = circularReference;

      // @ts-expect-error Testing invalid params
      setCachedValue(circularReference, {});

      expect(sessionStorage.setItem).not.toHaveBeenCalled();
    });
  });
});
