
import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { geminiService } from './services/gemini';
import ChatMessage from './components/ChatMessage';
import { INTERNAL_KNOWLEDGE_BASE } from './constants/knowledge';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Initialize session with "under the hood" knowledge
  useEffect(() => {
    if (!initialized.current) {
      geminiService.startSession(INTERNAL_KNOWLEDGE_BASE);
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! I can help you with the 1947 London Christmas menu. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
      initialized.current = true;
    }
  }, []);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      let accumulatedContent = '';
      const stream = geminiService.sendMessageStream(input);

      for await (const chunk of stream) {
        accumulatedContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: accumulatedContent }
              : msg
          )
        );
      }
    } catch (error) {
      console.error("Communication error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: "Error: Could not process request. Please check your network connection." }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-[#020617] shadow-2xl overflow-hidden md:border-x border-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-5 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-10 h-10 bg-slate-800 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/10 border border-slate-700 flex items-center justify-center">
              <img 
                src="https://243088642-371719071296988-227174979095224272-n.tiiny.site/243088642_371719071296988_227174979095224272_n.jpg" 
                alt="Nova Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-100 tracking-tight leading-none mb-1">1947 LONDON</h1>
            <div className="flex items-center space-x-2 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span>Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="text-slate-400 hover:text-white transition-colors">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-slate-900/50 backdrop-blur-md border-t border-slate-800">
        <form 
          onSubmit={handleSendMessage}
          className="relative flex items-center group"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Type your message..."
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-2xl pl-5 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 active:scale-95 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:scale-100 shadow-lg shadow-indigo-600/10"
          >
            {isTyping ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-arrow-up"></i>}
          </button>
        </form>
        <div className="flex justify-center mt-3 space-x-6 text-[10px] text-slate-500 font-medium">
          <span className="flex items-center"><i className="fas fa-bolt mr-1 text-indigo-500/70"></i> 1947 London</span>
          <span className="flex items-center"><i className="fas fa-shield-alt mr-1 text-indigo-500/70"></i> Secure Session</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
