import React from "react";
import "../styles/gear.css";

export default function Gear({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box gear-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">🛡️ Gear System (Coming Soon)</h2>
        <p>
          This feature will allow you to collect, equip, and manage gear for
          stat boosts and challenges.
        </p>
        <p>
          Each challenge may drop different gear tiers and bonuses. Stay tuned!
        </p>
      </div>
    </div>
  );
}
