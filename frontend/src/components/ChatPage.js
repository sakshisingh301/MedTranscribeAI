// ChatPage.js
import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import ChatResponseBubble from './ChatResponseBubble';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSendMessage = (message, files) => {
    if (message.trim() || files.length > 0) {
      // Add user's message
      const userMessage = {
        id: Date.now(),
        text: message,
        type: 'user',
        files: files,
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      // -------------------------------
      // Uncomment and fill in your OpenAI API key details to integrate real responses
      /*
      const fetchResponseFromOpenAI = async (userMessageText) => {
        const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer YOUR_OPENAI_API_KEY`
          },
          body: JSON.stringify({
            prompt: userMessageText,
            max_tokens: 50
          })
        });
        const data = await response.json();
        return data.choices[0].text.trim();
      };

      fetchResponseFromOpenAI(message).then((botReply) => {
        const botMessage = {
          id: Date.now() + 1,
          text: botReply,
          type: 'bot',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      });
      */

      // For testing, simulate a bot response after a short delay
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: "Hello, How may I help you?",
          type: 'bot',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      }, 500);
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
          messages.map((msg) =>
            msg.type === 'user' ? (
              <ChatBubble key={msg.id} message={msg.text} type={msg.type} />
            ) : (
              <ChatResponseBubble key={msg.id} message={msg.text} />
            )
          )
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
