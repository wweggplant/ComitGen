import * as assert from 'assert';
import * as vscode from 'vscode';
import AuthSettings from '../../AuthSettings';
import * as sinon from 'sinon';

suite('Extension Test Suite', () => {
    let showInformationMessageStub: sinon.SinonStub;
    let showInputBoxStub: sinon.SinonStub;
    let executeCommandStub: sinon.SinonStub;

    setup(() => {
        showInformationMessageStub = sinon.stub(vscode.window, 'showInformationMessage');
        showInputBoxStub = sinon.stub(vscode.window, 'showInputBox');
        executeCommandStub = sinon.stub(vscode.commands, 'executeCommand');
    });

    teardown(() => {
        showInformationMessageStub.restore();
        showInputBoxStub.restore();
        executeCommandStub.restore();
    });

    test('API key should be set correctly', async () => {
        showInputBoxStub.resolves('my-api-key');
        await vscode.commands.executeCommand('ComitGen.setApiKey');
        assert.strictEqual(AuthSettings.instance.getAuthData(), 'my-api-key');
        assert.ok(showInformationMessageStub.calledWith('API Key set successfully!'));
    });

    test('ComitGen.setApiKey should be triggered if no API key', async () => {
        AuthSettings.instance.resetAuthData();
        await vscode.commands.executeCommand('ComitGen.startGenCommitMessage');
        assert.ok(executeCommandStub.calledWith('ComitGen.setApiKey'));
    });

    // Add more tests here
});
