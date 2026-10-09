# Lint PR title with conventional commit spec

This action helps ensure that pull request titles follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, improving readability and enabling automated tooling.

## Inputs

### `types`

**Required** List of allowed types for conventional commit-like title, one per line.

### `scopes`

**Required** List of allowed scopes for conventional commit-like title, one per line.

## Example usage

```yaml
name: "Lint PR"
on:
  pull_request:
    types:
      - opened
      - edited

jobs:
  title:
    name: Title
    if: github.event.action == 'opened' || github.event.changes.title.from
    runs-on: ubuntu-latest
    steps:
      - uses: geo-engine/conventional-pr-title@v2
        with:
          types: |-
            build
            ci
            docs
            feat
            fix
            perf
            refactor
            test
          scopes: |-
            ascope
            anotherscope
```

The action only works with `pull_request` events.

## Breaking changes

Breaking changes can be marked with a `!` directly before the colon, as described in the specification:

- `feat!: drop support for old API`
- `feat(ascope)!: change the config format`

The `!` must come after the scope, so `feat!(ascope): …` is invalid.

## Upgrading from v1

- Titles with a breaking-change `!` are now accepted.
- The action runs on Node.js 24 instead of Node.js 20.
  Self-hosted runners need a runner version that supports `node24`.

## Development

Run the tests:

```sh
npm test
```

Create dist folder before committing.

```sh
npm run build
```
