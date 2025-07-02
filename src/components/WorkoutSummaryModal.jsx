// src/components/WorkoutSummaryModal.jsx
import React from "react";
import "../styles/levelUp.css"; // Keep this or split into workoutSummary.css

export default function WorkoutSummaryModal({
  onClose,
  buffs,
  xp,
  stats,
  currentXp = 0,
  currentStats = {},
}) {
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

        <h3>⭐ XP</h3>
        <div className="summary-line">
          <span className="summary-label">Current XP:</span>
          <span className="summary-value">{currentXp}</span>
          <span className="summary-gain">+{xp}</span>
        </div>

        <h3>📊 Stat Gains</h3>
        <div className="summary-section">
          {Object.entries(stats).map(([stat, gain]) =>
            gain > 0 ? (
              <div key={stat} className="summary-line">
                <span className="summary-label">
                  {stat.charAt(0).toUpperCase() + stat.slice(1)}:
                </span>
                <span className="summary-value">{currentStats[stat] ?? 0}</span>
                <span className="summary-gain">+{gain}</span>
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
