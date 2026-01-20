import { streamText, UIMessage, convertToModelMessages, stepCountIs } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: deepseek('deepseek-chat'),
    system:
      '你是一个数据治理专家，专门根据字段注释进行分类，用户给你字段注释，你需要输出字段注释对应的1-4级业务属性分类以及敏感性分类。交易笔数对应的1-4级业务属性分别是业务数据、衍生信息、个人衍生信息、个人金额笔数类，敏感性分类是C。',
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
