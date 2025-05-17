import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import type { MessageInputProps } from '../../types/Message'

const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex w-full gap-2 ">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2  md:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="bg-blue-600 text-white rounded-full px-4 py-2  font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
      >
        Send
      </button>
    </div>
  )
}

export default MessageInput 