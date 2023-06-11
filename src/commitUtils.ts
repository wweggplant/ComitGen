
import * as vscode from 'vscode';
import { getGenCommitMessage } from './commitGenerator';
import { setCommitMsg } from "./gitExtension";
import { getGitExtension } from "./gitExtension";
import { API, Repository } from "./api/git";
/**
 * Choose the relevant repo and apply autofill logic on files there.
 */
export async function _chooseRepoForAutofill(message: string, sourceControl?: vscode.SourceControl) {
  const git = getGitExtension()!;
  _validateFoundRepos(git);

  vscode.commands.executeCommand("workbench.view.scm");

  const selectedRepo = sourceControl
    ? await _handleRepos(git, sourceControl)
    : await _handleRepo(git);

  if (!selectedRepo) {
    const msg = "No repos found";
    vscode.window.showErrorMessage(msg);
    throw new Error(msg);
  }

  await setCommitMsg(selectedRepo, message);
}
/**
 * Return a repo for single repo in the workspace.
 */
async function _handleRepo(git: API): Promise<Repository> {
  return git.repositories[0];
}
/**
 * Get current repo when using multiples in the workspace (or when using GitLens on a single repo).
 */
async function _handleRepos(
  git: API,
  sourceControl: vscode.SourceControl
): Promise<Repository | false> {
  const selectedRepo = git.repositories.find(repository => {
    const uri = sourceControl.rootUri;
    if (!uri) {
      console.warn("rootUri not set for current repo");
      return false;
    }
    const repoPath = repository.rootUri.path;

    return repoPath === uri.path;
  });

  return selectedRepo ?? false;
}
function _validateFoundRepos(git: API) {
  let msg = "";

  if (!git) {
    msg = "Unable to load Git Extension";
  } else if (git.repositories.length === 0) {
    msg =
      "No repos found. Please open a repo or run `git init` then try again.";
  }

  if (msg) {
    vscode.window.showErrorMessage(msg);

    throw new Error(msg);
  }
}
/*
 wrap getGenCommitMessage function with try catch. show error by vscode.window.showErrorMessage
*/
export async function _getGenCommitMessage() {
  let message = '';
  let loading = vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: "Generating commit message...",
    cancellable: false
  }, async () => {
    console.log('start to generate commit message');
    try {
      message = await getGenCommitMessage();
    } catch (error: any) {
      console.log(error, 'error');
      if (typeof error.message === 'string') {
        vscode.window.showErrorMessage(error.message);
      } else {
        vscode.window.showErrorMessage('An error occurred while generating commit message.');
      }
    }
  });
  await loading;
  return message;
}


export const outputChannel = vscode.window.createOutputChannel('ComitGen');

export function log(...args: any[]) {
    const message = args.map(arg => {
        if (typeof arg === 'string') {
            return arg;
        } else {
            return JSON.stringify(arg, null, 2);
        }
    }).join(' ');

    outputChannel.appendLine(message);
}