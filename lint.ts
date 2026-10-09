import lint from "@commitlint/lint";
import createPreset from "conventional-changelog-conventionalcommits";

export async function lintTitle(title: string, types: string[], scopes: string[]) {
  // the conventionalcommits preset allows `!` for breaking changes, e.g. `feat!: …` or `feat(scope)!: …`
  // (its typings declare the preset as `{}`, but it contains the parser options at runtime)
  const {parser: parserOpts} = createPreset() as {parser: NonNullable<Parameters<typeof lint>[2]>['parserOpts']};

  return lint(title, {
      'type-empty': [2, 'never'],
      'type-enum': [2, 'always', types],
      'scope-enum': [2, 'always', scopes],
      'subject-empty': [2, 'never'],
  }, {parserOpts});
}
