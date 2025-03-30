import React, { useState, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa'; // Import microphone icon
import '../styles/AudioRecorder.css'; // Import the CSS file

const AudioRecorder = () => {
  // State to control display of the recorder UI
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
        // Optionally, you can call a function to save the audio file here
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
    <div className="audio-recorder-container">
      {/* When recorder is hidden, show the "Manual Recording" button */}
      {!showRecorder && (
        <button
          onClick={() => setShowRecorder(true)}
          className="manual-recording-btn"
        >
          Manual Recording
        </button>
      )}

      {/* Once "Manual Recording" is pressed, show the recorder UI */}
      {showRecorder && (
        <div>
          <div className="audio-recorder-form">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              className="audio-recorder-input"
            />

            {/* Microphone icon as recording button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`audio-recorder-icon-button ${isRecording ? 'recording' : ''}`}
              title={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              <FaMicrophone />
            </button>
          </div>

          {/* Audio playback */}
          {audioURL && (
            <div className="audio-recorder-audio-player">
              <audio controls src={audioURL}></audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
