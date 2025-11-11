"use client";

import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { removeUser } from "../utils/userSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ pendingRequests: 0, totalConnections: 0 });

  // hide navbar for landing and login pages
  if (location.pathname === "/" || location.pathname === "/login") return null;

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/connection/stats`, {
        withCredentials: true,
      });
      setStats(res.data);
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (error) {
      console.log("Logout failed:", error);
    }
  };

  return (
    <div className="navbar bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 fixed top-0 z-50 shadow-md px-8 text-white">
      <div className="flex-1">
        <Link
          to="/feed"
          className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
        >
          DevConnect 💞
        </Link>
      </div>

      <div className="flex gap-6 items-center">
        <Link to="/feed" className="hover:text-blue-400 transition">
          Feed
        </Link>

        <div className="relative">
          <Link to="/connections" className="hover:text-green-400 transition">
            Connections
          </Link>
          {stats.totalConnections > 0 && (
            <span className="absolute -top-2 -right-3 bg-green-500 text-xs font-bold text-white rounded-full px-2 py-[1px]">
              {stats.totalConnections}
            </span>
          )}
        </div>

        <div className="relative">
          <Link to="/requests" className="hover:text-yellow-400 transition">
            Requests
          </Link>
          {stats.pendingRequests > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-xs font-bold text-white rounded-full px-2 py-[1px] animate-pulse">
              {stats.pendingRequests}
            </span>
          )}
        </div>

        <Link to="/profile" className="hover:text-pink-400 transition">
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="btn btn-sm bg-red-600 hover:bg-red-700 text-white border-none"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
