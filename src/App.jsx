
import React, {useState} from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import { PokemonProvider } from './context/PokemonContext.jsx'
import { AuthState } from './components/auth/authState.js'

// Stub pages for routing
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Data from './pages/Data.jsx'
import Realtime from './pages/Realtime.jsx'

import './styles/global.css'


export default function App() {
   const [tasks, setTasks] = useState([
    'Sleep 7 hours',
    'Exercise for 30 minutes',
    'Read a book for 1 hour',
  ]);

  const [authState, setAuthState] = useState(AuthState.Unknown);
  const [userEmail, setUserEmail] = useState('');

  function handleAuthChange(email, state) {
    setUserEmail(email);
    setAuthState(state);
  }

  return (
  <PokemonProvider>
    <Router>
      <div className="app-container">
        {/* Header */}
        <header>
          <h1>HabitBuddy Startup App</h1>
          <nav>
            <NavLink to="/" className="nav-link">Home</NavLink>
            <NavLink to="/about" className="nav-link">About</NavLink>
            <NavLink to="/data" className="nav-link">Tasks</NavLink>
            <NavLink to="/realtime" className="nav-link">Friends</NavLink>
            <NavLink to="/login" className="nav-link">Login / Register</NavLink>
          </nav>
        </header>

        {/* Main routed content */}
        <Routes>
          <Route path="/" element={<Home tasks={tasks} />} />
          <Route path="/about" element={<About />} />
          <Route path="/data" element={<Data tasks={tasks} setTasks={setTasks} />} />
          <Route path="/realtime" element={<Realtime />} />
          <Route path="/login" element={<Login userEmail={userEmail} authState={authState} onAuthChange={handleAuthChange} /> } />
          <Route path="*" element={<main><h2>404 – Page not found</h2></main>} />
        </Routes>

        {/* Footer */}
        <footer>
          <p>© 2025 HabitBuddy. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  </PokemonProvider>
  )
}
