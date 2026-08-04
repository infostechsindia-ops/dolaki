'use client';

import React, { useState } from 'react';
import { FiMessageCircle, FiX, FiSend, FiCornerDownRight } from 'react-icons/fi';
import styles from './AuraAI.module.css';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function AuraAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Hey bestie! I am AuraAI, your shopping bff. Ask me anything or click one of the tags below! 💜' }
  ]);

  const quickPrompts = [
    { text: 'Recommend a phone 📱', reply: 'OMG, you should totally get the AuraWatch Elite Smartwatch or hook up AuraPods Pro! They literally give you maximum aura points! 🌟' },
    { text: 'Where is my order? 🚚', reply: 'No worries! Your order is being handled by our riders. You can track its live route on your Account page under Order History! 🚚' },
    { text: 'Coupons? 🏷️', reply: 'Use code AURA100 at checkout for flat ₹100 off on orders above ₹500! It is literally a steal, bestie! 🤫' },
    { text: 'Earn AuraCoins? 🪙', reply: 'Easy! Check-in daily on your Profile tab or start a Group Buy deal with friends to multiply your coins! 🪙' }
  ];

  const handleQuickPromptClick = (prompt: typeof quickPrompts[0]) => {
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: prompt.text }]);
    
    // Simulate bot response after typing delay
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: prompt.reply }]);
    }, 600);
  };

  const [inputVal, setInputVal] = useState('');

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInputVal('');

    setTimeout(() => {
      // Friendly fallback reply
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: "Honestly, that sounds like a vibe! I am just a simple bff chatbot for now, but you can try using code AURA100 or check out the reward streak room in your Profile! 💜" 
      }]);
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={styles.chatBubble}
        aria-label="AuraAI Chat Assistant"
        style={{ left: '24px', right: 'auto' }} // Positioned opposite to Spin & Win button (bottom-left)
      >
        <FiMessageCircle size={24} />
        <span className={styles.pulseRing}></span>
      </button>

      {/* Chat window drawer */}
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.avatarSec}>
              <span className={styles.avatar}>🔮</span>
              <div>
                <h4>AuraAI Assistant</h4>
                <span>Active now</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>
              <FiX size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea}>
            {messages.map((m, idx) => (
              <div key={idx} className={`${styles.messageRow} ${m.sender === 'user' ? styles.userRow : styles.botRow}`}>
                <div className={styles.messageBubble}>
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick options stubs */}
          <div className={styles.quickPromptsGrid}>
            {quickPrompts.map((qp, idx) => (
              <button 
                key={idx} 
                onClick={() => handleQuickPromptClick(qp)}
                className={styles.quickBtn}
              >
                <FiCornerDownRight size={10} /> {qp.text}
              </button>
            ))}
          </div>

          {/* Footer message composer input */}
          <form onSubmit={handleSendCustomMessage} className={styles.chatFooter}>
            <input 
              type="text" 
              placeholder="Ask AuraAI a question..." 
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendBtn} aria-label="Send message">
              <FiSend size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
