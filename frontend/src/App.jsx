import { Routes, Route } from "react-router-dom"
import { Homepage } from './Homepage'
import { About} from './About';
import { Contact} from './Contact'
import Chat from './Chat'
import './App.css'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
      <Route path="chat" element={<Chat />} />
    </Routes>
  )
}

export default App
