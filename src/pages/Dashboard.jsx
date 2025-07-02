import "../styles/global.css"; // just in case it's not already global

// src/pages/Dashboard.jsx
import NavButtons from "../components/NavButtons";

export default function Dashboard() {
  return (
    <div style={{ padding: "1rem", maxWidth: "500px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>ForgeU Dashboard</h1>
      <NavButtons />
    </div>
  );
}
