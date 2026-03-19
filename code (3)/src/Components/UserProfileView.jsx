"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          withCredentials: true,
        });
        console.log("✅ User Profile Fetched:", res.data);
        setUser(res.data.data || res.data);
      } catch (err) {
        console.error("❌ Error fetching user profile:", err);
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error shadow-lg max-w-sm">
          <span>{error}</span>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-sm btn-ghost"
          >
            Go Back
          </button>
        </div>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-2xl text-gray-400">User not found</h2>
      </div>
    );

  const {
    FirstName = "",
    LastName = "",
    PhotoUrl,
    Age,
    Gender,
    About,
    Skills = [],
  } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 px-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 btn btn-outline btn-sm text-slate-300 hover:bg-slate-800 border-slate-600"
      >
        ← Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="rounded-2xl p-8 bg-gradient-to-b from-gray-800/70 to-gray-900/70 border border-gray-700 shadow-2xl">
          {/* Profile Image */}
          <div className="flex flex-col items-center">
            <img
              src={PhotoUrl || "/placeholder.svg"}
              alt={FirstName}
              className="w-40 h-40 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
            />

            <h1 className="mt-6 text-4xl font-bold text-white">
              {FirstName} {LastName}
            </h1>

            {Age && Gender && (
              <p className="text-slate-400 text-lg mt-2">
                {Age} • {Gender}
              </p>
            )}
          </div>

          {/* About */}
          {About && (
            <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
              <h3 className="text-slate-300 font-semibold mb-2">About</h3>
              <p className="text-slate-200 leading-relaxed">{About}</p>
            </div>
          )}

          {/* Skills */}
          {Skills && Skills.length > 0 && (
            <div className="mt-8">
              <h3 className="text-slate-300 font-semibold mb-4">Skills</h3>
              <div className="flex flex-wrap gap-3">
                {Skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-300 font-medium text-sm"
                  >
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={() => navigate("/connections")}
              className="btn bg-gradient-to-r from-emerald-600 to-emerald-700 border-none text-white hover:shadow-lg transition-all px-8"
            >
              Back to Connections
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileView;
