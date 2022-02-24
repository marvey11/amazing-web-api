# Amazing Web Application (REST API/Backend)

Based on the original Amazing application, written in Python.

## Prerequisites and Preparations

Building and/or running the code requires [Node.js](https://nodejs.org/). The code has been tested with version 16.x,
though others should work as well.

The alternative package manager `yarn` (classic) was used during development. It is recommended, though not required, to
use `yarn` as well. This can be installed using

```shell
npm --global add yarn
```

After cloning/downloading the repository, the dependencies need to be installed. This can be done running the following
command from the root directory of the repository (the location where `package.json` can be found):

```shell
# when not using yarn, 'npm install' can be used alternatively
yarn install
```

If only the run-time dependencies are needed (and not the development dependencies listed under `devDependencies` in
`package.json`), the following command can be used instead:

```shell
yarn install --production
```

The database and the dedicated database user need to be created before the application is run for the first time. This
can be done using the following SQL commands:

```sql
CREATE DATABASE IF NOT EXISTS amazing;
CREATE USER IF NOT EXISTS codescape IDENTIFIED BY "codescape";
GRANT ALL PRIVILEGES ON `amazing`.* TO 'codescape'@'%' IDENTIFIED BY "codescape";
```

The names for the database name the user that were used in the above SQL command can be found in the configuration file
`ormconfig.json` which provides these configuration items for use in the application.

In order to simplify this process, a file `sql/init-db.sql` with the above contents has been added to the repository.
Some GUI SQL clients, like for example HeidiSQL on Windows, provide the ability to run an SQL srcipt file. From the
command line it can be run using the following command:

```shell
mariadb -u root -p < sql/init-db.sql
```

The database tables do _not_ need to be initialised at this point since, for the moment, the database mode is set to use
_synchronisation_ in `ormconfig.json`. This means that, as long as the database schema is modified in a way that does
not break the existing tables, the database will be automatically updated. Later, in production mode, this feature will
be turned off since database schema changes should not occur any longer at that point.

## API Testing

Manual API testing can be done using the [Advanced Rest Client](https://install.advancedrestclient.com/). This client
can also be used for easily adding data to/retrieving data from the database via the REST API.

In order to actually do the testing, the backend needs to be running. It can be started from the project root using the
following command line

```shell
# when not using yarn, 'npm run start-dev' can be used alternatively
yarn run start-dev
```

## Current Limitations

At the moment only support for the MySQL (actually MariaDB) database is provided. Support for other databases (e.g.
SQLite, PostgreSQL, ...) will be added in the future.
