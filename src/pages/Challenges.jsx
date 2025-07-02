import React from "react";

export default function Challenges({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>Challenges</h2>
        <p>Challenge tracking coming soon.</p>
      </div>
    </div>
  );
}
