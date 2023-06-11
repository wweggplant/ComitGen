import simpleGit from 'simple-git';
import { ChatOpenAI } from "langchain/chat_models/openai";
import { getConfig } from './config';
import { ChatPromptTemplate } from "langchain/prompts";
import { get_encoding } from 'tiktoken';
import { HumanChatMessage, AIChatMessage, SystemChatMessage } from "langchain/schema";
import { log } from './commitUtils';

// 这个函数获取 git diff
async function getGitDiff(): Promise<string> {
  const { fsPath } = await getConfig();
  const gitP = simpleGit(fsPath);
  const diff = await gitP.diff(['--cached']);
  return diff;
}
// 读取config的prompt, 使用{diff}作为占位符, 并把diff和prompt拼接成最后的prompt
const getPrompt = async (diff: string) => {

  const { promptTemplate: template, assistantPromptTemplate } = await getConfig();
  //we had got apikey,  set it to context. for OpenAI use
  // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(
  //     template
  //   ),
  //   HumanMessagePromptTemplate.fromTemplate("{diff}"),
  //   AIMessagePromptTemplate.fromTemplate(
  //     assistantPromptTemplate
  //   )
  // ]);
  // return await chatPrompt.format({
  //   diff
  // });
  return [
    new SystemChatMessage(
      template
    ),
    new AIChatMessage(
      assistantPromptTemplate
    ),
    new HumanChatMessage(
      diff
    ),
  ];
};
// 这个函数调用 OpenAI 的模型生成摘要
export async function getCommitMessage(diff: string): Promise<string> {
  const { apiKey: openAIApiKey, baseURL } = await getConfig(); // 从配置中获取 apiKey, modelName 和 prompt
  const tokenCount =  countTokens(diff);
  const modelName = tokenCount > 4096 ? 'gpt-3.5-turbo-16k' : 'gpt-3.5-turbo';
  const model = new ChatOpenAI({ openAIApiKey, temperature: 0.8, modelName }, { basePath: baseURL, baseOptions: { baseURL } }); // 使用这些配置来初始化 OpenAI 模型
  const prompt = await getPrompt(diff);
  log(prompt, 'prompt');
  // return await '123123';
  const response = await model.call(prompt);
  return response.text;
}

export async function getGenCommitMessage() {
  const diff = await getGitDiff();
  // if diff is empty, return a 异常
  if (!diff) {
    throw new Error("No changes to commit.");
  }
  return await getCommitMessage(diff);
}

function countTokens(text: string){
  const enc = get_encoding('gpt2');
  const count = enc.encode(text).length;
  enc.free();
  return count;
}