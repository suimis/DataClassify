import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();
  const result = streamText({
    model: deepseek('deepseek-chat'),
    system: '你是一个数据治理专家，为我解答关于数据治理方面的问题。',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
