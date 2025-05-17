export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'peer';
  timestamp: Date;
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export interface MessageListProps {
  messages: Message[];
} 