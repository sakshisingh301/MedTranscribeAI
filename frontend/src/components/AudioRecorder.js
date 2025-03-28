import React, { useState, useRef } from 'react';
import { FaMicrophone } from 'react-icons/fa'; 
import '../styles/AudioRecorder.css'; 

const AudioRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [filename, setFilename] = useState('recorded_audio');
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
                saveAudioFile(audioBlob);
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

    const saveAudioFile = (audioBlob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(audioBlob);
        a.download = `${filename || 'recorded_audio'}.wav`; // Use custom filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="audio-recorder-container">
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
    );
};

export default AudioRecorder;
