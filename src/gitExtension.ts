/**
 * Git extension module.
 *
 * Perform tasks related to the built-in Git extension.
 *
 * This module takes care of the high-level flow of the extension, after a repo
 * is selected in the `extension.ts` module.
 *
 * Flow:
 * 1. read Git output
 * 2. process it with the logic in the generate module
 * 3. set the value in the commit message box.
 */
import * as vscode from "vscode";
import { GitExtension, Repository } from "./api/git";


/**
 * Set the commit message in the Git Extension pane's input.
 */
export function setCommitMsg(repository: Repository, msg: string) {
  repository.inputBox.value = msg;
}

/**
 * Return VS Code's built-in Git extension.
 */
export function getGitExtension() {
  const vscodeGit = vscode.extensions.getExtension<GitExtension>("vscode.git");
  const gitExtension = vscodeGit && vscodeGit.exports;

  return gitExtension && gitExtension.getAPI(1);
}
