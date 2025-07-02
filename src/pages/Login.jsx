import { useState } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "../styles/auth.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 👈 New state
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username: username.trim(),
          xp: 0,
          level: 1,
          joinedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          gear: [],
          unlockedSkills: {},
          decayPenalty: false,
          stats: {
            strength: 1,
            endurance: 1,
            agility: 1,
            speed: 1,
            flexibility: 1,
          },
          buffStats: {
            willpower: 0,
            discipline: 0,
            recovery: 0,
            resilience: 0,
            charisma: 0,
          },
          buffFlags: {
            willpowerReady: false,
            resilienceActive: false,
            resilienceActivatedAt: null,
          },
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            className="auth-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="auth-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="auth-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">
          {isLogin ? "Login" : "Register"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </form>
      <p className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Register here"
          : "Already have an account? Login"}
      </p>
    </div>
  );
}
