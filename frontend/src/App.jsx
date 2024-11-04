import { Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing/Landing.jsx'
import Login from './Components/Login/Login.jsx'
import Home from './Components/Home/Home.jsx'
import Register from './Components/Register/Register.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  )
}

export default App
