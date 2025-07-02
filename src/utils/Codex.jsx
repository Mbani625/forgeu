import React from "react";
import "../styles/codex.css"; // Adjust if codex has its own styles

export default function Codex({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box codex-modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2 className="modal-title">📘 Stat Codex</h2>

        <h3>🔹 Attributes</h3>
        <ul>
          <li>
            <strong>Strength:</strong> Measures raw power. Gained from lifting
            volume.
          </li>
          <li>
            <strong>Agility:</strong> Measures body control and responsiveness.
            Gained from cardio.
          </li>
          <li>
            <strong>Endurance:</strong> Represents sustained energy output.
            Gained from repeated effort.
          </li>
          <li>
            <strong>Speed:</strong> Represents explosive output. Improved
            through sprints.
          </li>
          <li>
            <strong>Flexibility:</strong> Reflects range of motion. Increased by
            stretching.
          </li>
        </ul>

        <h3>🔹 Buffs</h3>
        <ul>
          <li>
            <strong>Willpower:</strong> Rewarded for pushing through hard
            workouts and adversity.
          </li>
          <li>
            <strong>Discipline:</strong> Gained through consistent workout
            logging and follow-through.
          </li>
          <li>
            <strong>Recovery:</strong> Improved by rest days, sleep, and
            cooldown activities.
          </li>
          <li>
            <strong>Resilience:</strong> Builds when bouncing back from failure
            or near-misses.
          </li>
          <li>
            <strong>Charisma:</strong> Social stat (placeholder). Will be tied
            to future squad and social systems.
          </li>
        </ul>
      </div>
    </div>
  );
}
