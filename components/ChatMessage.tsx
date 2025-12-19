
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const logoUrl = "https://243088642-371719071296988-227174979095224272-n.tiiny.site/243088642_371719071296988_227174979095224272_n.jpg";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 mt-1 mr-3 border border-slate-700 shadow-lg shadow-black/20">
          <img 
            src={logoUrl} 
            alt="Nova AI" 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div 
        className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-xl transition-all ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-600/10' 
            : 'bg-slate-800/80 border border-slate-700 text-slate-100 rounded-tl-none shadow-black/20'
        }`}
      >
        <div className={`whitespace-pre-wrap text-[14px] leading-relaxed ${isUser ? 'text-white' : 'text-slate-200'}`}>
          {message.content}
        </div>
        <div className={`text-[9px] mt-2 flex items-center ${isUser ? 'text-indigo-200 justify-end' : 'text-slate-500 justify-start'}`}>
          <i className="far fa-clock mr-1 opacity-50"></i>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
