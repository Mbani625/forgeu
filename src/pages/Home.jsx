import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Profile from "./Profile";
import WorkoutLog from "./WorkoutLog";
import LevelUp from "./LevelUp";
import Challenges from "./Challenges";
import Stats from "./Stats";
import Squads from "./Squads";
import Login from "./Login";
import "../styles/global.css";
import Codex from "../utils/Codex"; // or wherever you're putting it
import Gear from "../utils/Gear";

function Home() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [firestoreUsername, setFirestoreUsername] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showWorkoutLog, setShowWorkoutLog] = useState(false);
  const [showChallenges, setShowChallenges] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showSquads, setShowSquads] = useState(false);
  const [showCodex, setShowCodex] = useState(false);
  const [showGear, setShowGear] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setFirestoreUsername(userSnap.data().username || "");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (!authChecked) return null;
  if (!user) return <Login />;

  return (
    <div className="home-container">
      <div className="welcome-box">
        <h1>Welcome {firestoreUsername ? `, ${firestoreUsername}!` : ""}</h1>
        <div className="button-grid">
          <button className="home-button" onClick={() => setShowLevelUp(true)}>
            Level Up
          </button>
          <button
            className="home-button"
            onClick={() => setShowWorkoutLog(true)}
          >
            Workout Log
          </button>
          <button
            className="home-button"
            onClick={() => setShowChallenges(true)}
          >
            Challenges
          </button>
          <button className="home-button" onClick={() => setShowSquads(true)}>
            Squads
          </button>
          <button className="home-button" onClick={() => setShowStats(true)}>
            Stats
          </button>
          <button className="home-button" onClick={() => setShowProfile(true)}>
            Profile
          </button>
          <button className="home-button" onClick={() => setShowGear(true)}>
            Gear
          </button>

          <button className="home-button" onClick={() => setShowCodex(true)}>
            Codex
          </button>
        </div>
      </div>

      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
      {showWorkoutLog && (
        <WorkoutLog onClose={() => setShowWorkoutLog(false)} />
      )}
      {showLevelUp && <LevelUp onClose={() => setShowLevelUp(false)} />}
      {showChallenges && (
        <Challenges onClose={() => setShowChallenges(false)} />
      )}
      {showStats && <Stats onClose={() => setShowStats(false)} />}
      {showSquads && <Squads onClose={() => setShowSquads(false)} />}
      {showCodex && <Codex onClose={() => setShowCodex(false)} />}
      {showGear && <Gear onClose={() => setShowGear(false)} />}
    </div>
  );
}

export default Home;
