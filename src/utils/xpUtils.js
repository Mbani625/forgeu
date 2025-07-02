export function calculateWorkoutXP(workout) {
  if (!workout || !workout.type) return 0;

  if (workout.type === "cardio") {
    const duration = parseInt(workout.duration || 0);
    return Math.floor(10 + duration * 1.5);
  }

  if (workout.type === "lifting") {
    let totalVolume = 0;

    if (Array.isArray(workout.setDetails)) {
      workout.setDetails.forEach((set) => {
        const reps = parseInt(set.reps || 0);
        const weight = parseFloat(set.weight || 0);
        totalVolume += reps * weight;
      });
    } else {
      const sets = parseInt(workout.sets || 0);
      const reps = parseInt(workout.reps || 0);
      const weight = parseFloat(workout.weight || 0);
      totalVolume = sets * reps * weight;
    }

    return Math.floor(totalVolume / 20); // XP scale for lifting
  }

  if (workout.type === "stretching") {
    const duration = parseInt(workout.duration || 0);
    return Math.floor(duration * 1); // 1 XP per min
  }

  return 0;
}

export function calculateXPForLevel(level) {
  return Math.floor(3000 * Math.pow(level, 2.3));
}

export function getLevelFromXP(totalXP) {
  let level = 1;
  let required = calculateXPForLevel(level);

  while (totalXP >= required) {
    level++;
    required = calculateXPForLevel(level);
  }

  return level - 1;
}

export function calculateStatGains(workout) {
  const gains = {
    strength: 0,
    agility: 0,
    endurance: 0,
    flexibility: 0,
    speed: 0,
  };

  if (!workout || !workout.type) return gains;

  if (workout.type === "lifting") {
    let totalVolume = 0;
    let totalSets = 0;

    if (Array.isArray(workout.setDetails)) {
      workout.setDetails.forEach((set) => {
        const reps = parseInt(set.reps || 0);
        const weight = parseFloat(set.weight || 0);
        totalVolume += reps * weight;
      });
      totalSets = workout.setDetails.length;
    } else {
      const sets = parseInt(workout.sets || 0);
      const reps = parseInt(workout.reps || 0);
      const weight = parseFloat(workout.weight || 0);
      totalVolume = sets * reps * weight;
      totalSets = sets;
    }

    gains.strength += Math.floor(totalVolume / 500); // 1 STR per 500 lbs moved
    gains.endurance += Math.floor(totalSets / 4); // 1 END per 4 sets
  }

  if (workout.type === "cardio") {
    const duration = parseInt(workout.duration || 0);
    if (workout.subtype === "distance") {
      gains.agility += Math.floor(duration / 10);
      gains.endurance += Math.floor(duration / 15);
    } else if (workout.subtype === "sprints") {
      gains.speed += Math.floor(duration / 5);
      gains.agility += Math.floor(duration / 10);
    }
  }

  if (workout.type === "stretching") {
    const duration = parseInt(workout.duration || 0);
    gains.flexibility += Math.floor(duration / 5);
  }

  return gains;
}
