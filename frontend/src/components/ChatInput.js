import React, { useState } from 'react';
import { Upload, Send } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      {/* File Upload Preview */}
      {files.length > 0 && (
        <div className="file-preview">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="file-preview-item"
            >
              <span>{file.name}</span>
              <button 
                onClick={() => removeFile(index)}
                className="file-remove-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input Area */}
      <div className="chat-input-container">
        {/* File Upload Input */}
        <label 
          htmlFor="file-upload" 
          className="chat-file-upload"
        >
          <Upload className="text-gray-600" />
          <input 
            type="file" 
            id="file-upload"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>

        {/* Message Input */}
        <input 
          type="text"
          placeholder="Enter a message"
          className="chat-message-input"
          value={message}
          onChange={handleMessageChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />

        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          className="chat-send-btn"
          disabled={!message.trim() && files.length === 0}
        >
          <Send />
        </button>
      </div>
    </>
  );
};

export default ChatInput;