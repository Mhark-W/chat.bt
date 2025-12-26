
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const logoUrl = "https://243088642-371719071296988-227174979095224272-n.tiiny.site/243088642_371719071296988_227174979095224272_n.jpg";

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start w-full group animate-in fade-in slide-in-from-bottom-3 duration-500`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0 mt-1 mr-3 border border-slate-700 shadow-xl shadow-black/40">
          <img src={logoUrl} alt="1947 London" className="w-full h-full object-cover scale-110" />
        </div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl transition-all shadow-2xl ${
          isUser 
            ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/20 border border-indigo-500/30' 
            : 'bg-slate-800/90 border border-slate-700 text-slate-100 rounded-tl-none shadow-black/50'
        }`}>
        <div className="whitespace-pre-wrap text-[14px] leading-relaxed">
          {message.content}
        </div>
        <div className={`text-[10px] mt-2 flex items-center font-medium tracking-wide uppercase opacity-50 ${isUser ? 'justify-end' : 'justify-start'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
