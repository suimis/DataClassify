import { Markdown } from './Markdown';

export default function Message({ message }) {
  return (
    <div key={message.id} className="flex flex-col ml-4 mb-4">
      {message.parts.map((part, i) => {
        switch (part.type) {
          case 'reasoning':
            return <pre key={i}>{part.text}</pre>;
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
