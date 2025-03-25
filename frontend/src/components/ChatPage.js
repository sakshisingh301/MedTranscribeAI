import React, { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message, files) => {
    const newMessage = {
      text: message,
      files: files,
      timestamp: new Date(),
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    console.log('Sending message:', newMessage);
  };

  return (
    <div className="chat-container">
      {/* Chat Header */}
      <ChatHeader title="Conversation Application" />

      {/* Chat Messages Area */}
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-messages-empty">
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <div>{msg.text}</div>
              {msg.files && msg.files.length > 0 && (
                <div className="text-sm text-gray-500">
                  Attached files: {msg.files.map(file => file.name).join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatPage;