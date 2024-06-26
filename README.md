To correctly update all dependencies without causing npm peer dependencies issues run: `nx migrate`.
To make sure all the code is correctly updated in the workspace in conformity with the changes, use `nx migrate --run-migrations`

To start client: `npx nx run client:serve`
To start server: `npx nx run server:serve`

App will be running on: `http://localhost:4200/`
