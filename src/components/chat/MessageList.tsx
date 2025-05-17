import type { MessageListProps } from '../../types/Message';

const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-full">
      {messages.map(message => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
              message.sender === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white'
            }`}
          >
            <p>{message.text}</p>
            <span className="text-xs text-gray-300 mt-1">
              {message.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList 