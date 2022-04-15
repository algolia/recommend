import { getAverageIndexes } from '../computeAverageIndexes';

const indexTracker = {
  A: {
    indexSum: 6,
    nr: 2,
  },
  B: {
    indexSum: 3,
    nr: 2,
  },
  C: {
    indexSum: 1,
    nr: 1,
  },
  D: {
    indexSum: 2,
    nr: 1,
  },
  E: {
    indexSum: 4,
    nr: 2,
  },
  F: {
    indexSum: 0,
    nr: 1,
  },
};

describe('getAverageIndexes', () => {
  test('sorts the items based on their average index thus preserving applied rules', () => {
    const result = getAverageIndexes(indexTracker, 2);

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "avgOfIndexes": 1.5,
          "objectID": "B",
        },
        Object {
          "avgOfIndexes": 2,
          "objectID": "E",
        },
        Object {
          "avgOfIndexes": 3,
          "objectID": "A",
        },
        Object {
          "avgOfIndexes": 50,
          "objectID": "F",
        },
        Object {
          "avgOfIndexes": 50.5,
          "objectID": "C",
        },
        Object {
          "avgOfIndexes": 51,
          "objectID": "D",
        },
      ]
    `);
  });
});
