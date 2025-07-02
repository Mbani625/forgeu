import React, { useEffect, useState } from "react";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { calculateXPForLevel } from "../utils/xpUtils";
import Buffs from "../utils/buffs";
import "../styles/stats.css";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Stats = ({ onClose }) => {
  const [stats, setStats] = useState({
    strength: 0,
    agility: 0,
    endurance: 0,
    speed: 0,
    flexibility: 0,
  });

  const [buffStats, setBuffStats] = useState({
    willpower: 0,
    discipline: 0,
    recovery: 0,
    resilience: 0,
    charisma: 0,
  });

  const [level, setLevel] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeTab, setActiveTab] = useState("attributes");

  useEffect(() => {
    const fetchStats = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const statData = data.stats || {};
          const buffData = data.buffStats || {};

          setStats({
            strength: statData.strength || 0,
            agility: statData.agility || 0,
            endurance: statData.endurance || 0,
            speed: statData.speed || 0,
            flexibility: statData.flexibility || 0,
          });

          setBuffStats({
            willpower: buffData.willpower || 0,
            discipline: buffData.discipline || 0,
            recovery: buffData.recovery || 0,
            resilience: buffData.resilience || 0,
            charisma: buffData.charisma || 0,
          });

          const lvl = data.level || 0;
          const currentXP = data.xp || 0;
          setLevel(lvl);

          const xpCurrentLevel = calculateXPForLevel(lvl);
          const xpNextLevel = calculateXPForLevel(lvl + 1);
          const progress =
            ((currentXP - xpCurrentLevel) / (xpNextLevel - xpCurrentLevel)) *
            100;
          setProgressPercent(Math.max(0, Math.min(99.9, progress)));
        }
      }
    };

    fetchStats();
  }, []);

  const attributeChartData = {
    labels: [
      `Strength [${stats.strength}]`,
      `Agility [${stats.agility}]`,
      `Flexibility [${stats.flexibility}]`,
      `Endurance [${stats.endurance}]`,
      `Speed [${stats.speed}]`,
    ],
    datasets: [
      {
        label: "Attribute Values",
        data: [
          stats.strength,
          stats.agility,
          stats.flexibility,
          stats.endurance,
          stats.speed,
        ],
        backgroundColor: "rgba(0, 183, 255, 0.4)",
        borderColor: "#00ffff",
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: { display: true },
        grid: { circular: false, color: "#333" },
        pointLabels: {
          color: "#fff",
          font: { family: "Orbitron", size: 14 },
        },
        ticks: { display: false },
        min: 0,
        suggestedMax: 30,
      },
    },
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box stats-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Stats Overview</h2>
        <div className="level-display">Level: {level}</div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="progress-text">Progress: {progressPercent.toFixed(1)}%</p>

        <div className="tab-buttons">
          <button
            className={activeTab === "attributes" ? "active" : ""}
            onClick={() => setActiveTab("attributes")}
          >
            Attributes
          </button>
          <button
            className={activeTab === "buffs" ? "active" : ""}
            onClick={() => setActiveTab("buffs")}
          >
            Buffs
          </button>
        </div>

        <div className="chart-container">
          {activeTab === "attributes" ? (
            <Radar data={attributeChartData} options={chartOptions} />
          ) : (
            <Buffs buffStats={buffStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
