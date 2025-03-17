# Refresh playwright

## Commands

- Runs the end-to-end tests. 

``` bash​
    pnpm exec playwright test
```

- Starts the interactive UI mode.
 
``` bash 
​   pnpm exec playwright test --ui 
```

- Runs the tests only on Desktop Chrome.

``` bash
    pnpm exec playwright test --project=chromium 
```

- Runs the tests in a specific file.

``` bash
​   pnpm exec playwright test example 
```

- Runs the tests in debug mode.

``` bash 
    pnpm exec playwright test --debug 
```
    
- Auto generate tests with Codegen.

``` bash 
    pnpm exec playwright codegen 
```

- We suggest that you begin by typing:

``` bash 
    pnpm exec playwright test 
```

- And check out the following files:

``` bash
  - .\tests\e2e\example.spec.ts - Example end-to-end test
  - .\tests-examples\demo-todo-app.spec.ts - Demo Todo App end-to-end tests
  - .\playwright.config.ts - Playwright Test configuration
```