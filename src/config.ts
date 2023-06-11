import * as vscode from 'vscode';
import AuthSettings from "./AuthSettings";

const DEFAULT_PROMPT = "Please play a senior programmer to generate Git Commit Message according to the Git Diff content. \nThe rules are as follows:\n1. Follow AngularJS's Git Commit specification, you must start with the appropriate Emoji and use Chinese output.\n2. The format is as follows:\n\n<type>(<scope>): <subject>\n<BLANK LINE> whitespace\n<body>\n<BLANK LINE> whitespace\n<footer>\n";

const DEFAULT_ASSISTANT_PROMPT_TEMPLATE = '✨ feat(module): 添加新功能模块\n\n新增了一个名为 module 的功能模块，该模块实现了以下特性：\n\n- 实现功能 A\n- 提供 API 接口 B\n- 优化性能问题\n\nBREAKING CHANGE: 该功能模块引入了一个新的配置项，旧有的配置文件需要进行相应的更新。\n';

export async function getConfig() {
  const config = vscode.workspace.getConfiguration('ComitGen');
  const baseURL = config.get('baseURL', 'https://api.openai.com/v1/');
  const apiKey = await AuthSettings.instance.getAuthData();
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const fsPath = workspaceFolders ? workspaceFolders[0].uri.fsPath : '';
  const promptTemplate = config.get('prompt', DEFAULT_PROMPT);
  const assistantPromptTemplate = config.get('assistantPrompt', DEFAULT_ASSISTANT_PROMPT_TEMPLATE);
  return { baseURL, apiKey, promptTemplate, assistantPromptTemplate, fsPath };
}
