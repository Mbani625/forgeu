import React, { useState, useContext } from "react";
import "../styles/levelUp.css";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../components/AuthContext";
import {
  calculateWorkoutXP,
  getLevelFromXP,
  calculateStatGains,
} from "../utils/xpUtils";
import {
  updateDisciplineOnWorkout,
  updateWillpowerOnWorkout,
  updateResilienceOnWorkout,
} from "../utils/buffsLogic";

import WorkoutSummaryModal from "../components/WorkoutSummaryModal";

export default function LevelUp({ onClose }) {
  const { currentUser } = useContext(AuthContext);
  const [exerciseType, setExerciseType] = useState("cardio");
  const [cardioSubtype, setCardioSubtype] = useState("distance");
  const [currentXp, setCurrentXp] = useState(0);
  const [currentStats, setCurrentStats] = useState({});
  const [liftingSets, setLiftingSets] = useState([{ reps: "", weight: "" }]);
  const [workout, setWorkout] = useState({
    name: "",
    duration: "",
    notes: "",
  });
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [appliedBuffs, setAppliedBuffs] = useState([]);
  const [finalXP, setFinalXP] = useState(0);
  const [gainedStats, setGainedStats] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetChange = (index, field, value) => {
    const updated = [...liftingSets];
    updated[index][field] = value;
    setLiftingSets(updated);
  };

  const addSet = () => {
    setLiftingSets([...liftingSets, { reps: "", weight: "" }]);
  };

  const removeSet = (index) => {
    const updated = liftingSets.filter((_, i) => i !== index);
    setLiftingSets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newWorkout = {
      ...workout,
      type: exerciseType,
      subtype: exerciseType === "cardio" ? cardioSubtype : null,
      date: new Date().toISOString(),
      sets: exerciseType === "lifting" ? liftingSets.length : null,
      setDetails: exerciseType === "lifting" ? liftingSets : null,
    };

    let xpGained = calculateWorkoutXP(newWorkout);
    let buffedXP = xpGained;
    newWorkout.xp = xpGained;

    const statGains = calculateStatGains(newWorkout);

    const workoutRef = collection(db, "users", currentUser.uid, "workouts");
    await addDoc(workoutRef, newWorkout);

    await updateDisciplineOnWorkout();
    await updateWillpowerOnWorkout();

    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    const buffFlags = userData.buffFlags || {};
    let buffsUsed = [];

    if (buffFlags.willpowerReady) {
      buffedXP = Math.floor(buffedXP * 1.1);
      buffsUsed.push("Willpower (10% XP Bonus)");
    }

    const resilience = await updateResilienceOnWorkout(userRef, newWorkout);
    if (resilience.triggered) {
      buffsUsed.push(resilience.label);
      buffedXP += resilience.xpBonus;
    }

    const currentXP = userData.xp || 0;
    const newXP = currentXP + buffedXP;
    const newLevel = getLevelFromXP(newXP);

    const updatedStats = { ...userData.stats } || {};
    Object.entries(statGains).forEach(([stat, value]) => {
      updatedStats[stat] = (updatedStats[stat] || 0) + value;
    });

    await updateDoc(userRef, {
      xp: newXP,
      level: newLevel,
      lastLogin: new Date().toISOString(),
      stats: updatedStats,
    });

    // 🔥 Set summary state
    setAppliedBuffs(buffsUsed);
    setFinalXP(buffedXP);
    setGainedStats(statGains);
    setCurrentXp(currentXP); // <- pulled BEFORE update
    setCurrentStats(userData.stats || {});
    setSummaryOpen(true);

    // 🔄 Reset form
    setWorkout({
      name: "",
      duration: "",
      notes: "",
    });
    setLiftingSets([{ reps: "", weight: "" }]);
    setCardioSubtype("distance");
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
          <h2>Level Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="levelup-scrollable">
              <label>
                Exercise Type:
                <select
                  value={exerciseType}
                  onChange={(e) => setExerciseType(e.target.value)}
                >
                  <option value="cardio">Cardio</option>
                  <option value="lifting">Lifting</option>
                  <option value="stretching">Stretching</option>
                </select>
              </label>

              {exerciseType === "cardio" && (
                <label>
                  Cardio Subtype:
                  <select
                    value={cardioSubtype}
                    onChange={(e) => setCardioSubtype(e.target.value)}
                  >
                    <option value="distance">Cardio (Distance)</option>
                    <option value="sprints">Cardio (Sprints)</option>
                  </select>
                </label>
              )}

              <label>
                Exercise Name:
                <input
                  type="text"
                  name="name"
                  value={workout.name}
                  onChange={handleChange}
                  placeholder="e.g., Squats or Sprinting"
                  required
                />
              </label>

              {exerciseType === "lifting" && (
                <>
                  <label>Set Details:</label>
                  {liftingSets.map((set, index) => (
                    <div key={index} className="set-row">
                      <span>Set {index + 1}</span>
                      <input
                        type="number"
                        placeholder="Weight"
                        value={set.weight}
                        onChange={(e) =>
                          handleSetChange(index, "weight", e.target.value)
                        }
                        min="0"
                      />
                      <input
                        type="number"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(e) =>
                          handleSetChange(index, "reps", e.target.value)
                        }
                        required
                        min="1"
                      />
                      {liftingSets.length > 1 && (
                        <button type="button" onClick={() => removeSet(index)}>
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="set-button-wrapper">
                    <button
                      type="button"
                      className="add-set-button"
                      onClick={addSet}
                    >
                      + Add Set
                    </button>
                  </div>
                </>
              )}

              {(exerciseType === "cardio" || exerciseType === "stretching") && (
                <label>
                  Duration (minutes):
                  <input
                    type="number"
                    name="duration"
                    value={workout.duration}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    required
                  />
                </label>
              )}

              <label>
                Notes:
                <textarea
                  name="notes"
                  value={workout.notes}
                  onChange={handleChange}
                  placeholder="Add any details here..."
                />
              </label>
            </div>

            <button type="submit">Log Workout</button>
          </form>
        </div>
      </div>

      {summaryOpen && (
        <WorkoutSummaryModal
          buffs={appliedBuffs}
          xp={finalXP}
          stats={gainedStats}
          currentXp={currentXp}
          currentStats={currentStats}
          onClose={() => {
            setSummaryOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
