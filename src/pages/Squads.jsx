import React from "react";

export default function Squads({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Squads</h2>
        <p>This feature is coming soon!</p>
      </div>
    </div>
  );
}
