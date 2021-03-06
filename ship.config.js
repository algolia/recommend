const fs = require('fs');
const path = require('path');

module.exports = {
  monorepo: {
    mainVersionFile: 'lerna.json',
    // We rely on Lerna to bump our dependencies.
    packagesToBump: [],
    packagesToPublish: [
      'packages/recommend-core',
      'packages/recommend-js',
      'packages/recommend-react',
      'packages/recommend-vdom',
    ],
  },
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  versionUpdated({ exec, dir, version }) {
    // Update package dependencies
    exec(
      `yarn lerna version ${version} --exact --no-git-tag-version --no-push --yes`
    );

    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    // Update version files
    updatePackagesVersionFile({
      version,
      files: [
        path.resolve(dir, 'packages', 'recommend-core', 'src', 'version.ts'),
        path.resolve(dir, 'packages', 'recommend-js', 'src', 'version.ts'),
        path.resolve(dir, 'packages', 'recommend-react', 'src', 'version.ts'),
        path.resolve(dir, 'packages', 'recommend-vdom', 'src', 'version.ts'),
      ],
    });
  },
  // Skip preparation if it contains only `chore` commits
  shouldPrepare({ releaseType, commitNumbersPerType }) {
    const { fix = 0 } = commitNumbersPerType;

    if (releaseType === 'patch' && fix === 0) {
      return false;
    }

    return true;
  },
};

function updatePackagesVersionFile({ version, files }) {
  for (const file of files) {
    fs.writeFileSync(file, `export const version = '${version}';\n`);
  }
}
