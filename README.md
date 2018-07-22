# egoose

Helper classes and functions for [Node.js 8+](https://nodejs.org/) written in [TypeScript](https://www.typescriptlang.org/).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egodigital/egoose
```

## Build

First install all required `node_modules` by executing

```bash
npm install
```

from module's folder.

Now, run [TypeScript compiler](https://www.npmjs.com/package/typescript) by executing

```bash
rm -rf ./lib
tsc && tsc -d
```

from same folder.

## Tests

Simply run the following command:

```bash
npm test
```

from module's folder.
