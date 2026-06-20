import { useState, useRef, useEffect } from 'react';
import { Message, DailyLog } from '../types';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight } from 'lucide-react';

interface AgentChatProps {
  userLogs: DailyLog[];
  activeChallenge: string | null;
}

export default function AgentChat({ userLogs, activeChallenge }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "wel-1",
      role: "assistant",
      content: "Hello! I am your AI Carbon Coach. 🌿 My goal is to help you decipher your footprint numbers, discover hidden energy-saving opportunities, and suggest simple habits tailored to your lifestyle. \n\nHow can I support your eco journey today? Select a topic below or type your custom question!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const autoSuggestions = [
    "How can I reduce food carbon emissions?",
    "What commute choice saves the most CO2?",
    "Guide me to make my home energy clean.",
    "My current footprint logs feedback please."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].slice(-8), // Send last few messages for rolling chat buffer
          userLogs,
          activeChallenge
        })
      });

      const data = await response.json();
      if (data.success && data.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `msg-agent-${Date.now()}`,
            role: 'assistant',
            content: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(data.error || 'Server returned empty response');
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          content: "Apologies! I hit a temporary network wall, but here's a warm Eco Tip: Did you know that air drying one load of laundry instead of using a standard tumble dryer prevents about 1.8 kg of CO2e emissions? Try it this week! Let's resume chatting shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: "wel-1-cleared",
        role: "assistant",
        content: "Logs reset! Ask me anything regarding household energy conservation, sustainable food replacements, carbon pricing, or transport optimizations.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-5 flex flex-col h-[520px]" id="agent-chat-panel">
      {/* Upper header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-100 dark:border-zinc-850">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl flex items-center justify-center border border-emerald-250 dark:border-emerald-800/60">
            <Sparkles className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              AI Carbon Coach <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
            </h3>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">Expert Advisor Powered by Gemini</span>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear Conversation History"
          aria-label="Clear Conversation History"
          className="text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages timeline body */}
      <div className="flex-1 overflow-y-auto p-2 py-4 space-y-4 max-h-[310px]">
        {messages.map((m) => {
          const isAgent = m.role === 'assistant';
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isAgent ? 'mr-auto' : 'ml-auto flex-row-reverse text-right'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                isAgent
                  ? 'bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-850 dark:text-emerald-400'
                  : 'bg-indigo-50 border-indigo-250 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-850 dark:text-indigo-450'
              }`}>
                {isAgent ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div className={`text-xs font-normal p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                  isAgent
                    ? 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none text-left'
                    : 'bg-indigo-600 text-white rounded-tr-none text-left shadow-sm'
                }`}>
                  {m.content}
                </div>
                <span className="block text-[8px] text-zinc-400 dark:text-zinc-500 font-mono">
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 rounded-2xl rounded-tl-none text-xs flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-100" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-200" />
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300" />
              <span>Analyzing carbon variables...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Auto Suggestions Chips */}
      {messages.length < 5 && (
        <div className="py-2 border-t border-zinc-50 dark:border-zinc-805/40 flex gap-1.5 flex-nowrap overflow-x-auto scrollbar-none shrink-0">
          {autoSuggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => sendMessage(s)}
              className="px-3 py-1 bg-zinc-50 dark:bg-zinc-800 border border-zinc-150 dark:border-zinc-750 text-zinc-600 dark:text-zinc-300 rounded-full walk text-[10px] font-semibold whitespace-nowrap hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input controls form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(inputValue);
        }}
        className="mt-2 border-t border-zinc-100 dark:border-zinc-850 pt-3 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={inputValue}
          disabled={loading}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask AI Coach tips... (e.g. 'Give vegetarian burger specs')"
          aria-label="Ask AI Coach tips"
          className="flex-1 text-xs px-3.5 py-3 border border-zinc-200 dark:border-zinc-750 rounded-xl bg-white dark:bg-zinc-905 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          disabled={loading || !inputValue.trim()}
          aria-label="Send message"
          className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
