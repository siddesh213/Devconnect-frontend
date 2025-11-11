"use client";

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion } from "framer-motion";

const UserCard = ({ user, onAction }) => {
  const dispatch = useDispatch();

  // ✅ Exact field names from backend
  const {
    _id,
    FirstName,
    LastName,
    Age,
    Gender,
    About,
    Skills,
    PhotoUrl, // backend exact match
  } = user;

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(`${BASE_URL}/SendConnection/${status}/${userId}`, {}, { withCredentials: true });
      dispatch(removeUserFromFeed(userId));
      if (onAction) onAction(userId);
    } catch (error) {
      console.log("Request Error:", error);
    }
  };

  return (
    <motion.div
      className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 max-w-sm mx-auto hover:shadow-blue-500/20 transition-all duration-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.3 }}
    >
      {/* Profile Image */}
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={PhotoUrl && PhotoUrl.trim() !== "" ? PhotoUrl : "/placeholder.svg"}
          alt={FirstName || "User"}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      {/* Info Section */}
      <div className="p-5">
        <h2 className="text-2xl font-semibold text-white mb-1 tracking-wide">
          {FirstName} {LastName}
        </h2>

        {Age && Gender && (
          <p className="text-sm text-slate-400 mb-2">
            {Age} • {Gender}
          </p>
        )}

        <p className="text-sm text-slate-300 line-clamp-2 mb-3 italic">
          {About || "No bio added yet."}
        </p>

        {/* Skills */}
        {Skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Skills.map((skill, i) => (
              <span
                key={i}
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md hover:scale-105 transition-transform duration-200"
              >
                🚀 {skill.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between mt-3">
          <button
            onClick={() => handleSendRequest("ignored", _id)}
            className="flex-1 mx-1 py-2 rounded-lg border border-red-400 text-red-400 font-semibold hover:bg-red-500 hover:text-white transition-colors"
          >
            ❌ Ignore
          </button>

          <button
            onClick={() => handleSendRequest("interested", _id)}
            className="flex-1 mx-1 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-green-500/20 transition-all"
          >
            ❤️ Interested
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;
