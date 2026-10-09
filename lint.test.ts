import * as assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {lintTitle} from './lint.ts';

const types = ['feat', 'fix'];
const scopes = ['ui', 'api'];

async function errorsOf(title: string): Promise<string[]> {
  const result = await lintTitle(title, types, scopes);
  return result.errors.map((error) => error.name);
}

describe('lintTitle', () => {
  for (const title of [
    'feat: add a feature',
    'fix(ui): fix the ui',
    'feat!: this is a breaking change',
    'feat(ui)!: this breaks the ui',
  ]) {
    it(`accepts "${title}"`, async () => {
      assert.deepEqual(await errorsOf(title), []);
    });
  }

  it('rejects `!` before the scope', async () => {
    assert.deepEqual(await errorsOf('feat!(ui): this breaks the ui'), ['type-empty', 'subject-empty']);
  });

  it('rejects unknown types', async () => {
    assert.deepEqual(await errorsOf('chore: do something'), ['type-enum']);
    assert.deepEqual(await errorsOf('chore!: do something'), ['type-enum']);
  });

  it('rejects unknown scopes', async () => {
    assert.deepEqual(await errorsOf('feat(db): add a table'), ['scope-enum']);
    assert.deepEqual(await errorsOf('feat(db)!: drop a table'), ['scope-enum']);
  });

  it('rejects missing subjects', async () => {
    assert.deepEqual(await errorsOf('feat:'), ['type-empty', 'subject-empty']);
    assert.deepEqual(await errorsOf('feat!: '), ['subject-empty']);
  });
});
