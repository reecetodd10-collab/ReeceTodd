import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import Modal from '../shared/Modal';
import UpgradePrompt from '../shared/UpgradePrompt';

export default function AIChat({ isOpen: externalOpen, onClose: externalOnClose }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const messagesEndRef = useRef(null);
  const isPremium = true; // TODO: Replace with actual subscription check

  const suggestedPrompts = [
    "Can I swap bench press for dumbbells?",
    "Best supplements for recovery?",
    "Why am I not seeing gains?",
    "Adjust workout for sore shoulder",
  ];

  useEffect(() => {
    if (externalOpen !== undefined) {
      setIsOpen(externalOpen);
    }
  }, [externalOpen]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleOpen = () => {
    if (!isPremium) {
      setShowUpgrade(true);
      return;
    }
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (externalOnClose) externalOnClose();
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Placeholder AI response
    setTimeout(() => {
      const aiMessage = {
        type: 'ai',
        text: `I understand you're asking about "${input}". This is a placeholder response. Future AI integration will provide personalized, context-aware answers based on your workout plan, supplement stack, and goals.`
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  if (!externalOpen && !isOpen) {
    return (
      <>
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent-blue)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 glow-blue z-40"
        >
          <MessageCircle size={24} className="text-white" />
        </button>
        <UpgradePrompt isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </>
    );
  }

  return (
    <>
      {!externalOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[var(--accent-blue)] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 glow-blue z-40"
        >
          <MessageCircle size={24} className="text-white" />
        </button>
      )}

      {(isOpen || externalOpen) && (
        <div className={`
          ${externalOpen ? 'fixed' : 'fixed'} inset-0 z-50 flex items-end justify-end p-4 pointer-events-none
        `}>
          <div 
            className="glass-card w-full max-w-md h-[600px] flex flex-col pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-2">
                <Sparkles className="text-[var(--accent-blue)]" size={20} />
                <h3 className="font-bold">AI Coach</h3>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-[var(--bg-elev-1)] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Sparkles className="mx-auto mb-4 text-[var(--accent-blue)]" size={48} />
                  <p className="text-secondary mb-4">
                    Ask about your stack, workouts, or nutrition...
                  </p>
                  <div className="space-y-2">
                    {suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestedPrompt(prompt)}
                        className="block w-full text-left px-4 py-2 bg-[var(--bg-elev-1)] hover:bg-[var(--bg-elev-2)] rounded-lg text-sm transition"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.type === 'user'
                        ? 'bg-[var(--accent-blue)] text-white'
                        : 'bg-[var(--bg-elev-1)] text-secondary'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[var(--glass-border)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a question..."
                  className="flex-1 px-4 py-2 bg-[var(--bg-elev-1)] border border-[var(--glass-border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent-blue)]"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-[var(--accent-blue)] rounded-lg hover:bg-[var(--accent-blue-hover)] transition"
                >
                  <Send size={20} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <UpgradePrompt isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  );
}
