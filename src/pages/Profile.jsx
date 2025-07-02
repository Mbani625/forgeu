// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import "../styles/global.css";

export default function Profile({ onClose }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const uid = auth.currentUser.uid;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="close-button" onClick={onClose}>
          ✕
        </button>
        <h2>Profile</h2>
        <p>
          <strong>Username:</strong> {profile.username}
        </p>
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Level:</strong> {profile.level}
        </p>
        <p>
          <strong>XP:</strong> {profile.xp}
        </p>
        <h3>Stats</h3>
        <p>
          <strong>Strength:</strong> {profile.stats?.strength || 0}
        </p>
        <p>
          <strong>Agility:</strong> {profile.stats?.agility || 0}
        </p>
        <p>
          <strong>Endurance:</strong> {profile.stats?.endurance || 0}
        </p>
        <p>
          <strong>Speed:</strong> {profile.stats?.speed || 0}
        </p>
        <p>
          <strong>Flexibility:</strong> {profile.stats?.flexibility || 0}
        </p>
      </div>
    </div>
  );
}
