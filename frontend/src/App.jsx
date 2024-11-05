import { Routes, Route } from 'react-router-dom'
import Landing from './Components/Landing/Landing.jsx'
import Login from './Components/Login/Login.jsx'
import Register from './Components/Register/Register.jsx'
import Home from './Components/Home/Home.jsx'
import CreateGroup from './Components/Home/CreateGroup.jsx'
import JoinGroup from './Components/Home/JoinGroup.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create-group" element={<CreateGroup />} />
      <Route path="/join-group" element={<JoinGroup />} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  )
}

export default App
