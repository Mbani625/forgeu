// src/utils/buffsLogic.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { getAuth } from "firebase/auth";

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours
const RESILIENCE_THRESHOLD = 8000;
const CARDIO_THRESHOLD_MINUTES = 45;

export async function updateDisciplineOnWorkout() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const today = new Date().toISOString().split("T")[0];
  const streak = data.streak || { current: 0, lastLogged: null };
  const buffs = data.buffStats || {
    willpower: 0,
    discipline: 0,
    recovery: 0,
    resilience: 0,
    charisma: 0,
  };

  if (streak.lastLogged === today) return;

  const prev = new Date(streak.lastLogged);
  const now = new Date(today);
  const diff = (now - prev) / (1000 * 60 * 60 * 24);

  streak.current = diff === 1 ? streak.current + 1 : 1;
  streak.lastLogged = today;

  if (streak.current >= 3) buffs.discipline += 1;

  await updateDoc(userRef, { streak, buffStats: buffs });
}

export async function updateWillpowerOnWorkout() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const data = userSnap.data();
  const today = new Date().toISOString().split("T")[0];
  const lastLogged = data.streak?.lastLogged;
  const buffs = data.buffStats || {};
  const flags = data.buffFlags || {};

  const diffDays = lastLogged
    ? (new Date(today) - new Date(lastLogged)) / (1000 * 60 * 60 * 24)
    : null;

  if (flags.willpowerReady) {
    // Use it, gain stat, reset
    buffs.willpower = (buffs.willpower || 0) + 1;
    flags.willpowerReady = false;
    flags.willpowerUsed = true;
  } else if (diffDays >= 2) {
    // Activate Willpower for next workout
    flags.willpowerReady = true;
    flags.willpowerUsed = false;
  }

  await updateDoc(userRef, {
    buffStats: buffs,
    buffFlags: flags,
  });
}

export const updateResilienceOnWorkout = async (userRef, workout) => {
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return { triggered: false };

  const data = userSnap.data();
  const flags = data.buffFlags || {};
  const now = Date.now();
  const lastActive = new Date(flags.resilienceActivatedAt || 0).getTime();

  // Cooldown check
  if (flags.resilienceActive && now - lastActive < COOLDOWN_MS) {
    return { triggered: false };
  }

  let isHighEffort = false;
  if (workout.type === "lifting") {
    let totalEffort = 0;

    if (Array.isArray(workout.setDetails)) {
      workout.setDetails.forEach((set) => {
        const reps = parseInt(set.reps || 0);
        const weight = parseFloat(set.weight || 0);
        totalEffort += reps * weight;
      });
    } else {
      const sets = parseInt(workout.sets || 0);
      const reps = parseInt(workout.reps || 0);
      const weight = parseFloat(workout.weight || 0);
      totalEffort = sets * reps * weight;
    }

    isHighEffort = totalEffort >= RESILIENCE_THRESHOLD;
  }

  if (
    workout.type === "cardio" &&
    parseInt(workout.duration || 0) >= CARDIO_THRESHOLD_MINUTES
  ) {
    isHighEffort = true;
  }

  if (isHighEffort) {
    await updateDoc(userRef, {
      "buffFlags.resilienceActive": true,
      "buffFlags.resilienceActivatedAt": new Date().toISOString(),
    });
    return { triggered: true, label: "Resilience (+25 XP)", xpBonus: 25 };
  }

  return { triggered: false };
};
