import * as core from '@actions/core';
import * as github from '@actions/github';
import lint from "@commitlint/lint";
import {PullRequest} from "@octokit/webhooks-types";

function parseInput(input: string): string[] {
  const inputs = [];
  for (const item of input.split('\n')) {
    const trimmedItem = item.trim();
    if (trimmedItem) {
      inputs.push(trimmedItem);
    }
  }
  return inputs;
}

try {
  const types = parseInput(core.getInput('types'));
  const scopes = parseInput(core.getInput('scopes'));

  if (!github.context.payload.pull_request) {
    throw new Error(`This action only works with pull_request events. But the event was: ${github.context.eventName}`);
  }

  console.log(`Validating PR title…`);

  const event = github.context.payload.pull_request as PullRequest;
  const pr_title = event.title;

  lint(pr_title, {
      'type-empty': [2, 'never'],
      'type-enum': [2, 'always', types],
      'scope-enum': [2, 'always', scopes],
      'subject-empty': [2, 'never'],
  }).then(() => {
    console.log(`PR title is valid!`);
  }).catch((error) => {
    console.log(`PR title is invalid!`);
    core.setFailed(error.message);
  });
  
  console.log(`PR title is valid!`);
} catch (error) {
  core.setFailed(error.message);
}
