"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import UserCard from "./UserCard";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noUsers, setNoUsers] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  // 🧠 Fetch feed data
  const getFeed = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/feed?limit=20`, {
        withCredentials: true,
      });

      if (res.data.message && res.data.message.length > 0) {
        setFeed(res.data.message);
        setNoUsers(false);
      } else {
        setNoUsers(true);
      }
    } catch (err) {
      console.log("Feed Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Check profile completeness
  const checkProfileCompleteness = () => {
    if (
      !user ||
      !user.PhotoUrl ||
      !user.About ||
      !user.Skills ||
      user.Skills.length === 0
    ) {
      setShowReminder(true);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    checkProfileCompleteness();
    getFeed();
  }, [user]);

  // 🧩 Move to next user card after Ignore/Interested
  const handleNextUser = (userId) => {
    setFeed((prev) => prev.filter((u) => u._id !== userId));
    if (currentIndex < feed.length - 1) setCurrentIndex(currentIndex + 1);
    else setNoUsers(true);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl text-gray-400">
        Loading feed...
      </div>
    );

  if (noUsers)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center space-y-4">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
          alt="no users"
          className="w-24 opacity-60"
        />
        <h1 className="text-3xl font-bold text-gray-400">
          No more users right now 😅
        </h1>
        <button
          className="btn btn-primary mt-2"
          onClick={() => {
            setNoUsers(false);
            getFeed();
          }}
        >
          🔄 Refresh Feed
        </button>
      </div>
    );

  const currentUser = feed[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex flex-col items-center justify-start text-white px-4 pt-10">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
        💞 Developer Feed
      </h1>

      {/* ⚠️ Profile Reminder Banner */}
      {showReminder && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-6 py-3 rounded-xl mb-6 shadow-lg flex items-center justify-between w-full max-w-lg"
        >
          <span>
            ⚡ Enhance your profile to impress other developers! <br />
            Add your <b>photo</b>, <b>bio</b>, and <b>skills</b>.
          </span>
          <button
            onClick={() => navigate("/profile/edit")}
            className="bg-black/20 text-white px-3 py-1 rounded-lg hover:bg-black/40 transition"
          >
            ✏️ Edit Now
          </button>
        </motion.div>
      )}

      {/* 🧩 User Card Display */}
      <AnimatePresence mode="wait">
        {currentUser && (
          <motion.div
            key={currentUser._id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl flex justify-center"
          >
            <UserCard user={currentUser} onAction={handleNextUser} />
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mt-6 text-sm text-gray-400">
        {feed.length - currentIndex - 1} profiles remaining
      </p>
    </div>
  );
};

export default Feed;
