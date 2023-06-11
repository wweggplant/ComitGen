/**
 * Autofill module.
 */
import * as vscode from "vscode";
import { Repository } from "./api/git";
import { setCommitMsg } from "./gitExtension";

export const NO_LINES_MSG = `\
Unable to generate message as no changes files can be seen.
Try saving your files or stage any new (untracked) files.\
`;

/**
 * Generate and fill a commit message in the Git extenside sidebar.
 *
 * Steps:
 *
 *   1. Read Git command output and the message in the Git Extension commit message box.
 *   2. Generate a message.
 *   3. Push message value to the commit message box.
 *
 * This is based on `prefixCommit` from the `git-prefix` extension.
 */
export async function makeAndFillCommitMsg(repository: Repository, newMsg: string) {


  setCommitMsg(repository, newMsg);
}
