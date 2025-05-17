import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ChatWindow from './components/chat/ChatWindow'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<ChatWindow />} />
      </Routes>
    </Router>
  )
}

export default App
