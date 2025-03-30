import React, { useState, useRef } from 'react';
import { Plus, Send, File } from 'lucide-react';
import { FaMicrophone } from 'react-icons/fa';

const ChatInput = ({ onSendMessage }) => {
  // Chat input states
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [language, setLanguage] = useState('English');
  const fileInputRef = useRef(null);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSend = () => {
    if (message.trim() || files.length > 0) {
      onSendMessage(message, files, language);
      setMessage('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  // --- Manual Recording (AudioRecorder functionality) ---
  const [showRecorder, setShowRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [filename, setFilename] = useState('recorded_audio'); // Default filename
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chat-input-wrapper">
      {/* Hidden file input for uploading files */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Preview of uploaded files */}
      {files.length > 0 && (
        <div className="file-preview-container">
          {files.map((file, index) => (
            <div key={index} className="file-preview-item">
              <File size={16} />
              <span className="file-name">{file.name}</span>
              <button onClick={() => removeFile(index)} className="file-remove-btn">
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="chat-input-container">
        {/* File Upload Button with white background and black text */}
        <button
          onClick={triggerFileInput}
          style={{
            backgroundColor: '#fff',
            color: '#000',
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            border: 'none',
            marginRight: '0.5rem',
          }}
          className="file-upload-btn"
        >
          <Plus size={24} />
        </button>

        {/* Language Label & Dropdown with Dark Mode styling */}
        <label htmlFor="language-select" className="language-label">
          Language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '50px',
            padding: '0.5rem 1rem',
            border: 'none',
            marginRight: '0.5rem',
          }}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>

        {/* Manual Recording Button with Dark Mode styling */}
        {!showRecorder && (
          <button
            onClick={() => setShowRecorder(true)}
            style={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '50px',
              padding: '0.5rem 1rem',
              border: 'none',
              marginRight: '0.5rem',
            }}
            className="manual-recording-btn"
          >
            Manual Recording
          </button>
        )}

        {/* Recorder UI appears once "Manual Recording" is clicked */}
        {showRecorder && (
          <div className="audio-recorder-container">
            <div className="audio-recorder-form">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="Enter filename"
                className="audio-recorder-input"
              />
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`audio-recorder-icon-button ${isRecording ? 'recording' : ''}`}
                title={isRecording ? 'Stop Recording' : 'Start Recording'}
              >
                <FaMicrophone />
              </button>
            </div>
            {audioURL && (
              <div className="audio-recorder-audio-player">
                <audio controls src={audioURL}></audio>
              </div>
            )}
          </div>
        )}

        {/* Text Input for Chat */}
        <input
          type="text"
          placeholder="Enter a message"
          value={message}
          onChange={handleMessageChange}
          className="message-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSend();
            }
          }}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="send-btn"
          disabled={!message.trim() && files.length === 0}
        >
          <Send size={24} />
        </button>
      </div>

      <p className="selected-language">Selected Language: {language}</p>
    </div>
  );
};

export default ChatInput;
