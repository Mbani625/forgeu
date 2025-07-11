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
import { startNetLinesCanvas } from "../components/NetLinesBackground";

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

  useEffect(() => {
    if (authChecked && user) {
      // Delay 1 frame to ensure canvas exists
      requestAnimationFrame(() => {
        startNetLinesCanvas();
      });
    }
  }, [authChecked, user]);

  if (!authChecked) return null;
  if (!user) return <Login />;

  return (
    <>
      <canvas id="net-lines-bg"></canvas>
      <div className="home-container">
        <div className="welcome-box">
          <div className="button-grid">
            <button
              className="home-button"
              onClick={() => setShowLevelUp(true)}
            >
              [ LEVEL UP ]
            </button>
            <button
              className="home-button"
              onClick={() => setShowWorkoutLog(true)}
            >
              [ LOG ]
            </button>
            <button
              className="home-button"
              onClick={() => setShowChallenges(true)}
            >
              [ CHALLENGES ]
            </button>
            <button className="home-button" onClick={() => setShowSquads(true)}>
              [ SQUADS ]
            </button>
            <button className="home-button" onClick={() => setShowStats(true)}>
              [ STATS ]
            </button>
            <button
              className="home-button"
              onClick={() => setShowProfile(true)}
            >
              [ PROFILE ]
            </button>
            <button className="home-button" onClick={() => setShowGear(true)}>
              [ GEAR ]
            </button>

            <button className="home-button" onClick={() => setShowCodex(true)}>
              [ CODEX ]
            </button>
          </div>
          [ The ForgeU System ]
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
    </>
  );
}

export default Home;
