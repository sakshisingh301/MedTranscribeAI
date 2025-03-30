import logo from './logo.svg';
import './App.css';
import './styles/Chat.css';
import ChatPage from './components/ChatPage';
import AudioRecorder from './components/AudioRecorder';


// index.js or App.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { FaRulerCombined } from 'react-icons/fa';

function App() {
  return (
    <div className="App">
      <ChatPage />
      
    </div>
  );
}

export default App;
