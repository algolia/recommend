import fs from 'fs';
import path from 'path';
import util from 'util';

import postcss from 'postcss';

import postCssConfig from '../postcss.config.mjs';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

const { plugins, ...cssConfig } = postCssConfig;

async function ensureDir(file) {
  const directory = path.dirname(file);

  if (!fs.existsSync(directory)) {
    await mkdir(directory);
  }
}

async function buildCss() {
  const [, , input, output] = process.argv;

  await ensureDir(output);

  const css = await readFile(input);
  const result = await postcss(plugins).process(css, {
    ...cssConfig,
    from: input,
    to: output,
  });
  await writeFile(output, [result.css].join('\n'), () => true);
}

buildCss();
