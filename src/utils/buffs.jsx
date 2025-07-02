import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const COOLDOWN_MS = 2 * 60 * 60 * 1000; // 2 hours

const Buffs = () => {
  const [buffFlags, setBuffFlags] = useState(null);

  useEffect(() => {
    const fetchBuffFlags = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setBuffFlags(data.buffFlags || {});
        }
      }
    };

    fetchBuffFlags();
  }, []);

  const isResilienceActive = () => {
    if (!buffFlags?.resilienceActive || !buffFlags?.resilienceActivatedAt)
      return false;
    const activatedTime = new Date(buffFlags.resilienceActivatedAt).getTime();
    const now = new Date().getTime();
    return now - activatedTime <= COOLDOWN_MS;
  };

  const isWillpowerActive = () => {
    return buffFlags?.willpowerReady === true;
  };

  return (
    <div className="buffs-container">
      <div className="buff-item">
        <div className="buff-label">
          Discipline {buffFlags?.discipline ? "✅" : "❌"}
        </div>
      </div>

      <div className="buff-item">
        <div className="buff-label">
          Willpower {isWillpowerActive() ? "✅" : "❌"}
        </div>
      </div>

      <div className="buff-item">
        <div className="buff-label">
          Resilience {isResilienceActive() ? "✅" : "❌"}
        </div>
      </div>
    </div>
  );
};

export default Buffs;
