Agent guidelines — package manager

- Use `yarn` for all dependency tasks and script execution.
- Do not run `npm install` or `npm run` in this repository.
- Use `yarn` (or `yarn <script>`) for installing, building, and running.

Examples:

```bash
yarn install
yarn build
yarn start
```

Rationale: the project is configured and tested with `yarn` (v1.x). Using `yarn` avoids lockfile and workspace inconsistencies.
