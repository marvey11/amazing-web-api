# Amazing Web Application (REST API/Backend)

Based on the original Amazing application, written in Python.

## Prerequisites

Building and/or running the code requires [Node.js](https://nodejs.org/). The code has been tested with version 16.x, though others should work as well.

The alternative package manager `yarn` (classic) was used during development. It is recommended, though not required, to use `yarn` as well. This can be installed using

```shell
npm --global add yarn
```

After cloning/downloading the repository, the dependencies need to be installed. This can be done using the following command from the root directory of the repository (the location where `package.json` can be found):

```shell
# when not using yarn, 'npm install' can be used alternatively
yarn install
```

If only the run-time dependencies are needed (and not the development dependencies listed under `devDependencies` in `package.json`), the following command can be used instead:

```shell
yarn install --production
```
