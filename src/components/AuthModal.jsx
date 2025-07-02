// src/components/AuthModal.jsx
import { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function AuthModal({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // new
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCred.user, { displayName: username });
        await auth.currentUser.reload();

        await setDoc(doc(db, "users", userCred.user.uid), {
          uid: userCred.user.uid,
          email: userCred.user.email,
          username: username,
          level: 1,
          xp: 0,
          stats: {
            strength: 1,
            agility: 1,
            stamina: 1,
          },
          workoutHistory: [],
        });
      }

      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <form
        onSubmit={handleAuth}
        style={{
          background: "#1f1f1f",
          padding: "2rem",
          borderRadius: "1rem",
          color: "white",
          minWidth: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
        />

        <button
          type="submit"
          style={{ width: "100%", padding: "0.75rem", marginBottom: "1rem" }}
        >
          {isLogin ? "Login" : "Register"}
        </button>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <p
          onClick={() => setIsLogin(!isLogin)}
          style={{ textAlign: "center", color: "#66fcf1", cursor: "pointer" }}
        >
          {isLogin
            ? "Need an account? Register"
            : "Already have an account? Login"}
        </p>
      </form>
    </div>
  );
}
