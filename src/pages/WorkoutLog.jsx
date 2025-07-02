import React, { useState } from "react";
import "../styles/workoutLog.css";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function WorkoutLog({ onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [workoutHistory, setWorkoutHistory] = useState([]);

  const handleFetch = async () => {
    if (!startDate || !endDate) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const workoutsRef = collection(db, "users", user.uid, "workouts");
    const q = query(
      workoutsRef,
      where("date", ">=", new Date(startDate).toISOString()),
      where("date", "<=", new Date(endDate).toISOString())
    );

    try {
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        let xp = data.xp;

        if (xp === undefined) {
          if (data.type === "cardio") {
            xp = 10 + parseInt(data.duration || 0);
          } else {
            xp = 10 + parseInt(data.sets || 0) * parseInt(data.reps || 0);
          }
        }

        return {
          id: doc.id,
          ...data,
          xp,
        };
      });

      setWorkoutHistory(results);
    } catch (err) {
      console.error("Error fetching workouts:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>Workout Log</h2>

        <div className="date-filter">
          <label>
            Start Date:
            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button className="fetch-button" onClick={handleFetch}>
            🔍 Fetch Workouts
          </button>
        </div>

        {workoutHistory.length === 0 ? (
          <p>No workouts found.</p>
        ) : (
          <div className="workout-log-list">
            {workoutHistory.map((entry, index) => (
              <div key={index} className="workout-entry">
                <p>
                  <strong>{new Date(entry.date).toLocaleString()}</strong>
                </p>
                <p>
                  {entry.name} ({entry.type}) — <strong>{entry.xp} XP</strong>
                </p>

                {entry.type === "cardio" && entry.duration && (
                  <p>⏱ Duration: {entry.duration} minutes</p>
                )}

                {entry.type === "lifting" && (
                  <p>
                    Sets: {entry.sets || "—"} | Reps: {entry.reps || "—"} |
                    Weight: {entry.weight || "—"} lbs
                  </p>
                )}

                {entry.notes && <p>📝 {entry.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
