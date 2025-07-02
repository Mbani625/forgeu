// src/components/NavButtons.jsx
export default function NavButtons() {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
    >
      <button onClick={() => console.log("Workout Log")}>Workout Log</button>
      <button onClick={() => console.log("Challenges")}>Challenges</button>
      <button onClick={() => console.log("Stats")}>Stats</button>
      <button onClick={() => console.log("Profile")}>Profile</button>
    </div>
  );
}
