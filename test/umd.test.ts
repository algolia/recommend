/**
 * @jest-environment node
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { JSDOM } from 'jsdom';

/**
 * Adds a UMD script to the JSDOM window
 * @param window A reference to the window provided by JSDOM
 * @param path The path to the bundle relative to the root of the project
 */
function addScript(window: JSDOM['window'], path: string) {
  const bundle = readFileSync(resolve(process.cwd(), path), 'utf8');

  const script = window.document.createElement('script');
  script.textContent = bundle;
  window.document.body.appendChild(script);
}

describe('UMD bundle', () => {
  test.each([
    { name: 'recommend-core' },
    { name: 'recommend-js' },
    {
      name: 'recommend-react',
      dependency: 'node_modules/react/umd/react.production.min.js',
    },
    { name: 'recommend-vdom' },
  ])('$name loads successfully', ({ name, dependency }) => {
    const { window } = new JSDOM('', { runScripts: 'dangerously' });

    const errorFn = jest.fn();
    window.addEventListener('error', errorFn);

    if (dependency) {
      addScript(window, dependency);
    }

    addScript(window, `packages/${name}/dist/umd/index.js`);

    expect(errorFn).not.toHaveBeenCalled();
    expect(window[`@algolia/${name}`]).toBeDefined();
  });
});
