// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { db } from "../firebase/firebase";
import { ref, get, child } from "firebase/database";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState("Loading AI insights...");
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user info
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Human-friendly date formatter
  const formatDate = (unix) => {
    if (!unix) return "Just now";
    const date = new Date(unix);
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Load AI summary from Firebase
  useEffect(() => {
    async function loadSummary() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          setSummary("No user logged in.");
          return;
        }

        const dbRef = ref(db);
        const snap = await get(child(dbRef, `ai_summaries/${userId}/latest`));

        if (snap.exists()) {
          const data = snap.val();
          setSummary(data.summary || "No summary available.");
          setTimestamp(data.timestamp || null);
        } else {
          setSummary("No AI summary available yet.");
        }
      } catch (err) {
        console.error("Error fetching AI summary:", err);
        setSummary("Failed to load AI summary.");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Current date & time
  const nowFormatted = formatDate(Date.now());

  return (
    <Layout>
      <div className="space-y-10">

        {/* 🌿 USER GREETING */}
        <div className="
        ">
          <h1 className="text-4xl font-extrabold text-green-800">
            {getGreeting()}, {user?.owner || "Plant Lover"} 👋
          </h1>

          <p className="text-green-900/70 text-lg mt-2">
            Today is {nowFormatted}
          </p>
        </div>

        {/* 🤖 AI SUMMARY SECTION */}
        <div className="
          rounded-3xl p-8
          bg-white/60 backdrop-blur-xl 
          border border-white/40 shadow-xl
        ">
          <h2 className="text-2xl font-bold text-green-900 mb-2">
            AI Garden Summary 🌱✨
          </h2>

          {/* Timestamp under title */}
          <p className="text-sm text-gray-700 mb-4">
            Last updated:{" "}
            <span className="font-semibold">
              {timestamp ? formatDate(timestamp) : "Just now"}
            </span>
          </p>

          {loading ? (
            <p className="text-gray-700">Loading insights...</p>
          ) : (
            <p className="text-gray-800 text-lg leading-relaxed">
              {summary}
            </p>
          )}
        </div>

      </div>
    </Layout>
  );
}
