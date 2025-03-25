import React, { useState, useRef } from 'react';
import { Plus, Send, File } from 'lucide-react';

const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...uploadedFiles]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSendMessage = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files);
      setMessage('');
      setFiles([]);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="chat-input-wrapper">
      {/* Completely Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* File Preview Area */}
      {files.length > 0 && (
        <div className="file-preview-container">
          {files.map((file, index) => (
            <div key={index} className="file-preview-item">
              <File size={16} />
              <span className="file-name">{file.name}</span>
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

      {/* Input Container */}
      <div className="chat-input-container">
        {/* File Upload Plus Button */}
        <button 
          onClick={triggerFileInput}
          className="file-upload-btn"
        >
          <Plus size={24} />
        </button>

        {/* Message Input */}
        <input 
          type="text"
          placeholder="Enter a message"
          value={message}
          onChange={handleMessageChange}
          className="message-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />

        {/* Send Button */}
        <button 
          onClick={handleSendMessage}
          className="send-btn"
          disabled={!message.trim() && files.length === 0}
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;