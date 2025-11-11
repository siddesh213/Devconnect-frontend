"use client";

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { UserRound, Code, Mail } from "lucide-react";

const Connections = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/connection/accepted`, {
        withCredentials: true,
      });
      console.log("✅ CONNECTIONS API RESPONSE:", res.data);
      setConnections(res.data.friends || []);
    } catch (error) {
      console.log("Connections Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-semibold text-gray-400">
        Loading your connections 🔄
      </div>
    );

  if (!connections || connections.length === 0)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
          alt="no connections"
          className="w-32 opacity-60 mb-4"
        />
        <h1 className="text-3xl font-bold text-slate-300">
          You don’t have any connections yet 🤝
        </h1>
        <p className="text-slate-400 mt-2">Start connecting with developers now!</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white py-16 px-6">
      <h1 className="text-center text-5xl font-extrabold mb-12 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
        ❤️ Your Developer Connections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {connections.map((user) => {
          const { _id, FirstName, LastName, PhotoUrl, Age, Gender, About, Skills } = user;

          return (
            <div
              key={_id}
              className="relative rounded-2xl p-6 bg-gradient-to-b from-gray-800/70 to-gray-900/70 
              border border-gray-700 shadow-2xl backdrop-blur-lg hover:scale-[1.02] 
              hover:shadow-emerald-500/20 transition-all duration-300 ease-in-out"
            >
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={PhotoUrl || "/placeholder.svg"}
                    alt={FirstName}
                    className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md hover:shadow-emerald-400/40 transition-shadow duration-300"
                  />
                  <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                </div>

                <h2 className="mt-4 text-2xl font-semibold tracking-wide">
                  {FirstName} {LastName}
                </h2>

                {Age && Gender && (
                  <p className="text-slate-400 text-sm mt-1">
                    {Age} • {Gender}
                  </p>
                )}

                {About && (
                  <p className="text-slate-300 text-center text-sm mt-3 max-w-xs">
                    {About.length > 60 ? About.slice(0, 60) + "..." : About}
                  </p>
                )}
              </div>

              {/* Skills */}
              {Skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {Skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-emerald-600/20 border border-emerald-500/30 rounded-full 
                      text-emerald-300 text-xs font-medium shadow-sm"
                    >
                      <Code className="inline-block w-3 h-3 mr-1 text-emerald-400" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="mt-6 flex justify-center gap-4">
                <button className="btn btn-sm bg-emerald-600 hover:bg-emerald-700 border-none text-white shadow-md hover:shadow-lg transition-all">
                  💬 Message
                </button>
                <button className="btn btn-sm btn-outline text-slate-300 hover:bg-slate-800 border-slate-600">
                  View Profile
                </button>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
