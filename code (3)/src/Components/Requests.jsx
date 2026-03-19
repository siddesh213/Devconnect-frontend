"use client";

import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // ✅ Accept / Reject request
  const reviewRequest = async (status, senderId) => {
    try {
      console.log(`📤 Sending review request: status=${status}, senderId=${senderId}`);
      
      const res = await axios.post(
        `${API_BASE_URL}/reviewrequest/${status}/${senderId}`,
        {},
        { withCredentials: true }
      );
      
      console.log(`✅ Review response:`, res.data);
      dispatch(removeRequest(senderId));
      setToastMsg(`✅ Request ${status} successfully!`);
      setTimeout(() => setToastMsg(""), 3000);
      
      // If accepted, notify user to view connections
      if (status === "accepted") {
        setTimeout(() => {
          setToastMsg("ℹ️ Check your Connections page to view their full profile!");
          setTimeout(() => setToastMsg(""), 3000);
        }, 1500);
      }
    } catch (error) {
      console.error("❌ Review Error:", error.response?.data || error.message);
      
      // Show detailed error message
      const errorMsg = error.response?.data?.message || "Failed to update request";
      setToastMsg(`❌ ${errorMsg}`);
      setTimeout(() => setToastMsg(""), 5000);
    }
  };

  // ✅ Fetch requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/connection/request/received`, {
        withCredentials: true,
      });
      
      console.log(`✅ Requests fetched:`, res.data);
      
      // Validate response structure
      if (res.data?.connectionRequests && Array.isArray(res.data.connectionRequests)) {
        dispatch(addRequests(res.data.connectionRequests));
        console.log(`Found ${res.data.connectionRequests.length} requests`);
      } else {
        console.warn("Unexpected response structure:", res.data);
        dispatch(addRequests([]));
      }
    } catch (error) {
      console.error("❌ Fetch Requests Error:", error.response?.data || error.message);
      
      // Show error message
      if (error.response?.status === 401) {
        console.log("Unauthorized - Please login again");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return <h2 className="text-center mt-20">Loading requests...</h2>;

  if (!requests || requests.length === 0)
    return (
      <div className="flex justify-center items-center h-96">
        <h1 className="text-2xl font-bold text-slate-400">
          No new connection requests 🚫
        </h1>
      </div>
    );

  return (
    <div className="text-center my-10 px-4">
      <h1 className="font-bold text-4xl bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-8">
        👁️ Requests ({requests.length})
      </h1>

      <div className="space-y-4 max-w-3xl mx-auto">
        {requests.map((req) => {
          const { _id, FirstName, LastName, PhotoUrl, Age, Gender, About } =
            req.FromUserId;

          return (
            <div
              key={_id}
              className="flex justify-between items-center p-6 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 flex-1">
                <img
                  alt="photo"
                  className="w-16 h-16 rounded-full object-cover border-4 border-yellow-500 shadow-md"
                  src={PhotoUrl || "/placeholder.svg"}
                />
                <div className="text-left">
                  <h2 className="font-bold text-xl text-white">
                    {FirstName} {LastName}
                  </h2>
                  {Age && Gender && (
                    <p className="text-slate-400 text-sm">
                      {Age} • {Gender}
                    </p>
                  )}
                  <p className="text-slate-300 text-sm mt-1 line-clamp-1">
                    {About || "No bio added"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => reviewRequest("accepted", req.FromUserId._id)}
                >
                  ✓ Accept
                </button>
                <button
                  className="btn btn-error btn-sm"
                  onClick={() => reviewRequest("rejected", req.FromUserId._id)}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Toast Notification */}
      {toastMsg && (
        <div className="toast toast-top toast-center pt-20">
          <div className="alert alert-success shadow-lg">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
