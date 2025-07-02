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
        <p>
          <strong>Join Date:</strong>{" "}
          {profile.joinedAt
            ? new Date(profile.joinedAt).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Title:</strong> {profile.title || "Adventurer"}
        </p>
      </div>
    </div>
  );
}
