// src/components/WorkoutSummaryModal.jsx
import React from "react";
import "../styles/levelUp.css"; // Or make workoutSummary.css if needed

export default function WorkoutSummaryModal({ onClose, buffs, xp, stats }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>✅ Workout Logged!</h2>

        <h3>⚡ Buffs Activated</h3>
        {buffs.length === 0 ? (
          <p>No buffs applied.</p>
        ) : (
          <ul>
            {buffs.map((buff, idx) => (
              <li key={idx}>🌀 {buff}</li>
            ))}
          </ul>
        )}

        <h3>⭐ XP Gained</h3>
        <p>{xp} XP</p>

        <h3>📊 Stat Gains</h3>
        <ul>
          {Object.entries(stats).map(([stat, val]) =>
            val > 0 ? (
              <li key={stat}>
                +{val} {stat}
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}
