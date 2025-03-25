import React from 'react';

const ChatBubble = ({ message, type = 'user' }) => {
  // Determine bubble styling based on sender type
  const bubbleClasses = type === 'user' 
    ? 'bg-blue-500 text-white self-end' 
    : 'bg-gray-200 text-black self-start';

  return (
    <div className={`chat-bubble-container ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`chat-bubble ${bubbleClasses}`}>
        <p className="break-words whitespace-pre-wrap">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;