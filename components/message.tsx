import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from './ai-elements/reasoning';
import { Markdown } from './Markdown';

interface MessagePart {
  type: string;
  text: string;
}

interface Message {
  id: string;
  role: string;
  parts: MessagePart[];
}

interface MessageProps {
  message: Message;
  status: string;
  active: boolean;
  last: string;
}

export default function Message({
  message,
  status,
  active,
  last,
}: MessageProps) {
  return (
    <div key={message.id} className="flex flex-col ml-4 mb-4">
      {status == 'submitted' && message.role == 'assistant' && active && (
        <span>loading</span>
      )}

      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'reasoning':
            return (
              <Reasoning
                key={`${message.id}-${i}`}
                className="w-full"
                isStreaming={
                  status === 'streaming' &&
                  i === message.parts.length - 1 &&
                  message.id === last
                }
              >
                <ReasoningTrigger />
                <ReasoningContent>{part.text}</ReasoningContent>
              </Reasoning>
            );
          case 'text':
            return (
              <div
                key={`${message.id}-${i}`}
                className={`inline-block flex items-center normal-font-black py-2 px-3 ${
                  message.role == 'user'
                    ? 'bg-gray-100 rounded-md ml-auto'
                    : 'mr-auto'
                }`}
              >
                <Markdown>{part.text}</Markdown>
              </div>
            );
        }
      })}

      {message.role == 'user' ? (
        <div className="ml-auto"></div>
      ) : (
        <div className="mr-auto"></div>
      )}
    </div>
  );
}
