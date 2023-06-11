import { getConfig } from '../../config';
import * as vscode from 'vscode';
import AuthSettings from '../../AuthSettings';

jest.mock('vscode', () => ({
  workspace: {
    getConfiguration: jest.fn(),
  },
  ExtensionContext: jest.fn(),
  SecretStorage: jest.fn(),
}), { virtual: true });

// Create a mock instance with the method getAuthData
jest.mock('../../AuthSettings', () => {
  // Mock methods
  const methods = {
    getAuthData: jest.fn(),
  };

  // Mock class for AuthSettings
  class MockAuthSettings {
    constructor() {
      return methods;
    }
  }

  // Mock the instance getter
  (MockAuthSettings as any).instance = methods;
  
  return {
    __esModule: true, // use it when dealing with transpiled modules
    default: MockAuthSettings,
  };
});
describe('getConfig', () => {
    it('should return the correct configuration', async () => {
      const mockData: Record<string, string | number> = {
        baseURL: 'https://mockurl.com',
        apiKey: 'mockApiKey',
        prompt: 'mockPrompt',
        assistantPrompt: 'mockAssistantPromptTemplate'
      };
      (vscode.workspace.getConfiguration as jest.Mock).mockImplementation(() => ({
        get: jest.fn().mockImplementation((key: string) => mockData[key])
      }));
    (AuthSettings.instance.getAuthData as jest.Mock).mockResolvedValue('mockApiKey');
    const result = await getConfig();
    expect(result).toEqual({
      baseURL: 'https://mockurl.com',
      apiKey: 'mockApiKey',
      fsPath: '',
      promptTemplate: 'mockPrompt',
      assistantPromptTemplate: 'mockAssistantPromptTemplate'
    });
  });
});