
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (!initialized.current) {
      geminiService.startSession(INTERNAL_KNOWLEDGE_BASE);
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: "Good evening. Welcome to 1947 London. I am your concierge for our Christmas Menu. How may I assist you with your festive booking or menu queries today?",
        timestamp: new Date(),
      }]);
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

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const assistantMsgId = (Date.now() + 1).toString();
    const assistantMessage: Message = { id: assistantMsgId, role: 'assistant', content: '', timestamp: new Date() };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      let accumulated = '';
      const stream = geminiService.sendMessageStream(input);
      for await (const chunk of stream) {
        accumulated += chunk;
        setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: accumulated } : m));
      }
    } catch (error) {
      setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: "I'm sorry, I'm experiencing a connectivity issue. Please try again in a moment." } : m));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-[#020617] md:border-x border-slate-800 shadow-2xl">
      <header className="bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 p-5 flex items-center justify-between z-20">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
            <img src="https://243088642-371719071296988-227174979095224272-n.tiiny.site/243088642_371719071296988_227174979095224272_n.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.1em] text-white">1947 LONDON</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Christmas Concierge
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <div ref={scrollRef} className="h-full overflow-y-auto p-6 space-y-8 scroll-smooth">
          {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          {isTyping && messages[messages.length - 1]?.content === '' && (
            <div className="flex justify-start ml-12 animate-pulse">
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 flex space-x-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-6 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
        <form onSubmit={handleSendMessage} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder="Ask about our Christmas menu..."
            className="w-full bg-slate-800/50 border border-slate-700 text-slate-100 rounded-2xl pl-6 pr-16 py-5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-500 text-sm shadow-inner"
          />
          <button
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all active:scale-90 disabled:bg-slate-700 disabled:text-slate-500 shadow-lg shadow-indigo-600/20"
          >
            {isTyping ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
          </button>
        </form>
        <div className="mt-4 flex justify-center space-x-8 text-[10px] text-slate-500 font-bold tracking-widest uppercase">
          <span className="flex items-center"><i className="fas fa-utensils mr-2 text-indigo-400"></i> Authentic Flavours</span>
          <span className="flex items-center"><i className="fas fa-calendar-check mr-2 text-indigo-400"></i> Festive Bookings</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
