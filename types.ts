
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FileData {
  name: string;
  content: string;
  size: number;
}
