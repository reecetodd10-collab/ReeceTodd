'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Send, Sparkles, Zap, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TESTING_MODE, hasPremiumAccess } from '../../lib/config';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function AIChat({ userIsPremium = false }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const isPremium = hasPremiumAccess(userIsPremium);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('aviera-ai-chat-history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('aviera-ai-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleChat = () => {
    if (!isPremium && !TESTING_MODE) {
      setShowUpgradeModal(true);
      return;
    }
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI typing delay
    setTimeout(() => {
      const aiMessage = {
        id: Date.now() + 1,
        text: "I'm Aviera AI, your intelligent fitness assistant. This feature will be powered by our custom AI model soon. For now, I'm in training mode.",
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 96)}px`;
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('aviera-ai-chat-history');
  };

  const suggestedPrompts = [
    "Can I swap bench press for dumbbells?",
    "Best supplements for recovery?",
    "Why am I not seeing gains?",
    "Adjust my plan for shoulder pain",
  ];

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={handleToggleChat}
        className="fixed bottom-5 right-5 z-[60] w-16 h-16 rounded-full glass-card flex flex-col items-center justify-center shadow-premium-lg hover:shadow-accent/50 transition-all duration-300 group backdrop-blur-xl border border-[var(--border)]/50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open Aviera AI chat"
      >
        {/* Subtle pulse animation ring */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--acc)]/20"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.2, 0, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <Sparkles size={20} className="text-[var(--acc)] mb-0.5 relative z-10 opacity-85" />
        <span className="text-[10px] font-medium text-[var(--txt)] relative z-10 tracking-tight leading-tight">Aviera AI</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Chat Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] md:w-[400px] h-[600px] md:h-[600px] max-h-[calc(100vh-2.5rem)] glass-card shadow-premium-lg flex flex-col overflow-hidden"
              ref={chatContainerRef}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--border)] bg-[var(--bg-elev-1)]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[var(--acc)]/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-[var(--acc)]" />
                  </div>
                  <h2 className="text-lg font-semibold text-[var(--txt)] tracking-tight">Aviera AI</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-[var(--bg-elev-2)] rounded-lg transition"
                  aria-label="Close chat"
                >
                  <X size={18} className="text-[var(--txt-muted)]" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--bg)]">
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[var(--acc)]/20 to-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-[var(--acc)]/10">
                      <Sparkles size={28} className="text-[var(--acc)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--txt)] mb-2 tracking-tight">
                      Welcome to Aviera AI
                    </h3>
                    <p className="text-sm text-[var(--txt-muted)] mb-6 max-w-sm">
                      Your intelligent fitness assistant. Ask me anything about your workouts, supplements, or nutrition.
                    </p>
                    
                    {/* Suggested Prompts */}
                    <div className="w-full space-y-2">
                      <p className="text-xs font-semibold text-[var(--txt-muted)] mb-2">
                        Try asking:
                      </p>
                      {suggestedPrompts.map((prompt, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(prompt)}
                          className="w-full text-left px-4 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt)] transition text-wrap"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-[var(--acc)] text-white'
                          : 'bg-[var(--bg-elev-1)] border border-[var(--border)] text-[var(--txt)]'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-[var(--bg-elev-1)] border border-[var(--border)] rounded-2xl px-4 py-3">
                      <div className="flex gap-1">
                        <motion.div
                          className="w-2 h-2 bg-[var(--txt-muted)] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[var(--txt-muted)] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        />
                        <motion.div
                          className="w-2 h-2 bg-[var(--txt-muted)] rounded-full"
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-elev-1)]">
                <div className="flex items-end gap-2">
                  <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your stack, workouts, or nutrition..."
                    className="flex-1 px-4 py-2 bg-[var(--bg)] border border-[var(--border)] rounded-lg text-sm text-[var(--txt)] placeholder:text-[var(--txt-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-transparent resize-none max-h-24 overflow-y-auto"
                    rows={1}
                    aria-label="Type your message"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={!inputValue.trim()}
                    className="p-2 bg-[var(--acc)] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="mt-2 text-xs text-[var(--txt-muted)] hover:text-[var(--txt)] transition"
                  >
                    Clear chat history
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upgrade Modal */}
      <Modal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Aviera AI is a Premium Feature"
      >
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[var(--acc)]/20 to-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--acc)]/10">
              <Sparkles className="text-[var(--acc)]" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-[var(--txt)] mb-2 tracking-tight">
              Unlock Aviera AI with Premium
            </h3>
            <p className="text-[var(--txt-muted)]">
              Get instant answers about your workouts, supplements, and nutrition from your intelligent AI assistant.
            </p>
          </div>

          <div className="mb-6 space-y-3 text-left max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm">
              <Sparkles size={18} className="text-[var(--acc)] flex-shrink-0" />
              <span className="text-[var(--txt)]">Ask questions about your workout plan</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Sparkles size={18} className="text-[var(--acc)] flex-shrink-0" />
              <span className="text-[var(--txt)]">Get supplement recommendations</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Zap size={18} className="text-[var(--acc)] flex-shrink-0" />
              <span className="text-[var(--txt)]">Receive instant nutrition advice</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MessageCircle size={18} className="text-[var(--acc)] flex-shrink-0" />
              <span className="text-[var(--txt)]">24/7 AI-powered fitness support</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              className="flex-1"
              onClick={() => {
                setShowUpgradeModal(false);
                router.push('/pricing');
              }}
            >
              Upgrade to Premium
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowUpgradeModal(false)}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

