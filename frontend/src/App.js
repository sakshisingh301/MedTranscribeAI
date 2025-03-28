import logo from './logo.svg';
import './App.css';
import './styles/Chat.css';
import ChatPage from './components/ChatPage';
import AudioRecorder from './components/AudioRecorder';

function App() {
  return (
    <div className="App">
      <ChatPage />
      <AudioRecorder/>
    </div>
  );
}

export default App;
