const core = require('@actions/core');
const github = require('@actions/github');
const commitlint = require('commitlint');

try {
  const types = JSON.parse(core.getInput('types'));
  const scopes = JSON.parse(core.getInput('scopes'));

  if (!github.context.payload.pull_request) {
    throw new Error(`This action only works with pull_request events. But the event was: ${github.context.eventName}`);
  }

  console.log(`Validating PR title…`);

  const pr_title = github.context.payload.pull_request.title;

  await commitlint.lint(pr_title, {
    rules: {
      'type-empty': [2, 'never'],
      'type-enum': [2, 'always', types],
      'scope-enum': [2, 'always', scopes],
      'subject-empty': [2, 'never'],
    },
  });
  
  console.log(`PR title is valid!`);
} catch (error) {
  core.setFailed(error.message);
}
