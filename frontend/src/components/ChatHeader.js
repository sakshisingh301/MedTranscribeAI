import React from 'react';

const ChatHeader = ({ title }) => {
  return (
    <header className="chat-header">
      <h1>{title || 'Conversation Application'}</h1>
    </header>
  );
};

export default ChatHeader;