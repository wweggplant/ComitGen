// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import AuthSettings from './AuthSettings';
import { _chooseRepoForAutofill, _getGenCommitMessage, outputChannel } from './commitUtils';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ComitGen" is now active!');
	context.subscriptions.push(outputChannel); // add output channel to context

	AuthSettings.init(context);
	const settings = AuthSettings.instance;

	let disposable = vscode.commands.registerCommand('ComitGen.startGenCommitMessage', async (sourceControl?: vscode.SourceControl) => {
		
		// Check if the API key is stored
		if (!settings.getAuthData()) {
			// run ComitGen.setApiKey command
			await vscode.commands.executeCommand('ComitGen.setApiKey');
		}
    const message = await _getGenCommitMessage();
    if (message) {
      _chooseRepoForAutofill(message, sourceControl);
    }
	});
	context.subscriptions.push(disposable);

	// set api key
	let setApiKeyDisposable = vscode.commands.registerCommand('ComitGen.setApiKey', async () => {
			const apiKey = await vscode.window.showInputBox({
					password: true,
					prompt: 'Enter your API Key. Your input will not be shown.'
			});

			if (apiKey) {
				await settings.storeAuthData(apiKey);
				vscode.window.showInformationMessage('API Key set successfully!');
			}
	});
	context.subscriptions.push(setApiKeyDisposable);
  // clear api key
  let clearApiKeyDisposable = vscode.commands.registerCommand('ComitGen.clearApiKey', async () => {
    await settings.resetAuthData();
    vscode.window.showInformationMessage('API Key cleared successfully!');
  });
  context.subscriptions.push(clearApiKeyDisposable);
}
// now, we go to start to launch plugin config section
// This method is called when your extension is deactivated
export function deactivate() {}

