import * as core from '@actions/core';
import * as github from '@actions/github';
import lint from "@commitlint/lint";
import {PullRequest} from "@octokit/webhooks-types";

function parseInput(input: string): string[] {
  const inputs = [];
  for (const item of input.split(/\r|\n/)) {
    const trimmedItem = item.trim();
    if (trimmedItem) {
      inputs.push(trimmedItem);
    }
  }
  return inputs;
}

async function run(): Promise<void> {
  const types = parseInput(core.getInput('types', { required: true }));
  const scopes = parseInput(core.getInput('scopes', { required: true }));

  console.log(`Allowed types: ${types}`);
  console.log(`Allowed scopes: ${scopes}`);

  if (!github.context.payload.pull_request) {
    throw new Error(`This action only works with pull_request events. But the event was: ${github.context.eventName}`);
  }

  console.log(`Validating PR title…`);

  const event = github.context.payload.pull_request as PullRequest;
  const pr_title = event.title;

  const result = await lint(pr_title, {
      'type-empty': [2, 'never'],
      'type-enum': [2, 'always', types],
      'scope-enum': [2, 'always', scopes],
      'subject-empty': [2, 'never'],
  });

  if (result.valid) {
    return;
  }

  if (result.errors.length > 0) {
    console.log('Errors:');
  }
  for (const outcome of result.errors) {
    console.log(`- ${outcome.name}: ${outcome.message}`);
  }

  if (result.warnings.length > 0) {
    console.log('Warnings:');
  }
  for (const outcome of result.warnings) {
    console.log(`- ${outcome.name}: ${outcome.message}`);
  }
  
  if (result.errors.length > 0) { // only fail if there are errors
    core.setFailed(`PR title is invalid!`);
  }
}

run().then(() => {
  console.log(`PR title is valid!`);
}).catch((error) => {
  core.setFailed(`Action failed: ${error.message}`);
});
