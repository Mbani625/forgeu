import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import WorkoutLog from "./pages/WorkoutLog";
import Challenges from "./pages/Challenges";
import Stats from "./pages/Stats";
import Profile from "./pages/Profile";
import Squads from "./pages/Squads";
import LevelUp from "./pages/LevelUp";

import "./styles/global.css"; // Real styles here
import { AuthProvider } from "./components/AuthContext"; // ✅ Wrap the app with this

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workout" element={<WorkoutLog />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/squads" element={<Squads />} />
          <Route path="/levelup" element={<LevelUp />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
