import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const initialMessages = [
  {
    id: 'bot-welcome',
    sender: 'bot',
    text: "Hi there! I'm the NourishLink assistant. Ask me about donating food, receiving food, NGO support, or rewards.",
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const quickReplies = [
  { label: 'Donate', value: 'How do I donate food on NourishLink?' },
  { label: 'Receive', value: 'How can I receive food as a receiver?' },
  { label: 'NGO Help', value: 'How can NGOs join and accept donations?' },
  { label: 'Rewards', value: 'How do I earn reward points?' },
];

const formatTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(
    localStorage.getItem('nourishlink_chat_session') || `session-${Date.now()}`
  );

  useEffect(() => {
    localStorage.setItem('nourishlink_chat_session', sessionIdRef.current);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const appendMessage = (message) => setMessages((current) => [...current, message]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    setError('');

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      createdAt: formatTime(),
    };

    const placeholderId = `bot-typing-${Date.now()}`;
    const botPlaceholder = {
      id: placeholderId,
      sender: 'bot',
      text: 'Typing...',
      createdAt: '',
      isTyping: true,
    };

    appendMessage(userMessage);
    appendMessage(botPlaceholder);
    setIsTyping(true);

    try {
      const response = await api.post('/chat', {
        message: text,
        sessionId: sessionIdRef.current,
      });

      const botText = response.data?.message || 'I’m sorry, I could not answer that right now.';

      setMessages((current) =>
        current.map((msg) =>
          msg.id === placeholderId
            ? {
                ...msg,
                text: botText,
                createdAt: formatTime(),
                isTyping: false,
              }
            : msg
        )
      );
    } catch (sendError) {
      const fallback =
        sendError.response?.data?.error ||
        'Something went wrong. Please try again in a moment.';

      setMessages((current) =>
        current.map((msg) =>
          msg.id === placeholderId
            ? {
                ...msg,
                text: fallback,
                createdAt: formatTime(),
                isTyping: false,
              }
            : msg
        )
      );
      setError(fallback);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput('');
  };

  const handleQuickReply = async (value) => {
    if (isTyping) return;
    await sendMessage(value);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-2xl shadow-primary-600/30 transition hover:bg-primary-700 focus:outline-none ${isOpen ? 'hidden' : 'inline-flex'}`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-xl h-[80vh] max-h-[720px] flex flex-col rounded-3xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 rounded-t-3xl bg-gradient-to-r from-primary-600 to-primary-700 p-4 text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Nourish Assistant</p>
                  <p className="text-xs text-white/80">
                    Ask about donations, receiving food, NGOs, or rewards.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex flex-1 flex-col overflow-hidden">
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-3xl px-4 py-3 shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-primary-600 text-white rounded-br-none'
                          : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none border border-gray-200 dark:border-slate-600'
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.text}</p>
                      <div className="mt-2 flex justify-end text-xs text-gray-400 dark:text-gray-500">
                        {message.isTyping ? <Loader2 className="h-3 w-3 animate-spin" /> : message.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section */}
              <div className="border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shrink-0">
                
                {/* Quick Replies */}
                <div className="mb-3 flex flex-wrap gap-2">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply.label}
                      onClick={() => handleQuickReply(reply.value)}
                      className="rounded-full border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      {reply.label}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-500/50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-primary-600 text-white disabled:bg-gray-300 dark:disabled:bg-slate-600 hover:bg-primary-700 dark:hover:bg-primary-500 transition"
                  >
                    {isTyping ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </button>
                </form>

                {error && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{error}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}