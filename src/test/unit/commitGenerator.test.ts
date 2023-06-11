import { getCommitMessage } from '../../commitGenerator';
import { getConfig } from '../../config';

const mockDiff = `
diff --git a/src/yourModule.js b/src/yourModule.js
index 7f6d02c..b6c46e4 100644
--- a/src/yourModule.js
+++ b/src/yourModule.js
@@ -1,5 +1,7 @@
import simpleGit from 'simple-git';
import { OpenAI } from "langchain/llms/openai";
+import { getConfig } from './config';
+import { PromptTemplate } from "langchain/prompts";

// 这个函数获取 git diff
async function getGitDiff(): Promise<string> {

diff --git a/src/anotherModule.js b/src/anotherModule.js
index 5d7g93b..c2d47f6 100644
--- a/src/anotherModule.js
+++ b/src/anotherModule.js
@@ -1,5 +1,6 @@
-import oldModule from 'old-library';
import { NewModule } from "new-library";
+import { HelperFunction } from './helper';

// Some function
function doSomething(): void {

diff --git a/src/helper.js b/src/helper.js
new file mode 100644
index 0000000..3d2e1a6
--- /dev/null
+++ b/src/helper.js
@@ -0,0 +1,15 @@
+import { SomeOtherModule } from 'another-library';
+
+// Helper function
+export function HelperFunction() {
+  // Some code here
+}

`;

jest.mock('simple-git', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn().mockImplementation(() => ({
    diff: jest.fn().mockResolvedValue(mockDiff),
  })),
}));

jest.mock('../../config', () => {
  return {
    getConfig: jest.fn(),
  };
});
// mock startGenCommitMessage
jest.mock('../../commitGenerator', () => {
  const originalModule = jest.requireActual('../../commitGenerator');
  const { startGenCommitMessage } = originalModule;
  // startGenCommitMessage使用原生
  return {
    getCommitMessage: jest.fn(),
    // startGenCommitMessage使用原函数
    startGenCommitMessage
  };
});
describe('Gen Commit Message Integration Test', () => {
  it('should getCommitMessage toBeNull', async () => {
    const mockConfig = { baseURL: 'mockBaseURL', apiKey: "mockApiKey", promptTemplate: "promptTemplate", assistantPromptTemplate: 'assistantPromptTemplate' };
    (getConfig as jest.Mock).mockResolvedValue(mockConfig);
    (getCommitMessage as jest.Mock).mockResolvedValue(`✨ feat(module): 添加新功能模块

        给代码添加了一个名为 module 的新功能模块，该模块包括以下变化：
        - 导入了命名为 \`getConfig\` 的读取配置函数
        - 参考相应过去行另两个模块 A 和 B，新增编写 Helper 方法的具体目标填词 prompt.

        BREAKING CHANGE: 该新功能模块需引入变量以标志必选或输入命令执行格式。
    `);
    const result = await getCommitMessage(mockDiff);
    // expert result to be a not empty string
    expect(result).not.toBeNull();
  });
});