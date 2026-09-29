import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Announcements from "./pages/Announcements"
import Login from "./pages/Login"
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Resources from "./pages/Resources";
import Clubs from "./pages/Clubs";
import LostFound from "./pages/LostFound";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} /> 
          <Route path="/events" element={<Events />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/lost-found" element={<LostFound />} />

        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App