import { getAverageIndices } from '../computeAverageIndices';

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

describe('getAverageIndices', () => {
  test('sorts the items based on their average index thus preserving applied rules', () => {
    const result = getAverageIndices(indexTracker, 2);

    expect(result).toMatchInlineSnapshot(`
      Array [
        Object {
          "avgOfIndices": 1.5,
          "objectID": "B",
        },
        Object {
          "avgOfIndices": 2,
          "objectID": "E",
        },
        Object {
          "avgOfIndices": 3,
          "objectID": "A",
        },
        Object {
          "avgOfIndices": 50,
          "objectID": "F",
        },
        Object {
          "avgOfIndices": 50.5,
          "objectID": "C",
        },
        Object {
          "avgOfIndices": 51,
          "objectID": "D",
        },
      ]
    `);
  });
});
