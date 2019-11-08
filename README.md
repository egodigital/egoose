[![npm](https://img.shields.io/npm/v/@egodigital/egoose.svg)](https://www.npmjs.com/package/@egodigital/egoose)

# egoose

Helper classes and functions for [Node.js 12+](https://nodejs.org/dist/latest-v12.x/docs/api/) written in [TypeScript](https://www.typescriptlang.org/).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egodigital/egoose
```

## Documentation

API documentation can be found [here](https://egodigital.github.io/egoose/).

## Samples

[egoose-samples](https://github.com/egodigital/egoose-samples) contains a repository of samples, which demonstrate, how to use the functions and classes of that module.

## Build

### Module

First install all required `node_modules` by executing

```bash
npm install
```

from module's folder.

Now, run [TypeScript compiler](https://www.npmjs.com/package/typescript) by executing

```bash
npm run build
```

from same folder.

### Publish

FIRST [BUILD](#build) THE MODULE BEFORE PUBLISH!

```bash
npm run build && npm publish
```

### Documentation

Execute

```bash
npm run doc
```

from module's root.

## Tests

Run the following command

```bash
npm test
```

from module's folder.
