import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSendMessage = (message, files) => {
    if (message.trim() || files.length > 0) {
      const newMessage = {
        id: Date.now(),
        text: message,
        type: 'user',
        files: files,
        timestamp: new Date()
      };

      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <ChatHeader title="MedTranscribe AI" />

      {/* Chat Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-messages-empty">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble 
              key={msg.id} 
              message={msg.text} 
              type={msg.type}
            />
          ))
        )}
        {/* Dummy div to enable scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;