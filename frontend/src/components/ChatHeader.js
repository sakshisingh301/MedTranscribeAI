import React from 'react';

const ChatHeader = ({ title }) => {
  return (
    <header className="chat-header">
      <h1>{title}</h1>
    </header>
  );
};

export default ChatHeader;