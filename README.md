# Lint PR title with conventional commit spec

This action helps ensure that pull request titles follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, improving readability and enabling automated tooling.

## Inputs

### `types`

**Required** List of allowed types for conventional commit-like title.

### `scopes`

**Required** List of allowed scopes for conventional commit-like title.

## Example usage

```yaml
uses: geo-engine/conventional-pr-title
with:
  types: [build, ci, docs, feat, fix, perf, refactor, test]
  scopes: [ascope, anotherscope]
```
