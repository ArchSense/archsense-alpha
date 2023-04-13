# Scout
> Generate services graph

## Installation
`npm install @archsense/scout`

## How to use

### Command line
`npx scout nestjs -p <root-file-path> -c <config-file-path> -o <output-file-path>`

#### Parameters
| Parameter Name      | CLI Attribute | CLI shortcut | Mandatory | Description                                                                 |
|---------------------|---------------|--------------|-----------|-----------------------------------------------------------------------------|
| Path to root folder   | --project     | -p           | Yes       | Path to the root project root folder. It is disregarded if `config` is provided.                                          |
| Path to config folder | --config      | -c           | No        | If you'd like to run scout on monorepo, pass config instead of project root |
| Path to output file | --output      | -o           | No        | If provided, the result will the stored in the output file                  |

### API
```js
const Scout = require('scout');

const nestjsScout = new Scout({
  rootPath: '<path-to-root-folder>',
  configPath: '<path-to-config-folder>',
  framework: 'nestjs',
});

const dependencyTree = await nestjsScout.analyze();
await nestjsScout.saveFile(outputFilePath, dependencyTree);
```

## Current support

* Supported languages
    * Typescript
* Supported framework
    * NestJs