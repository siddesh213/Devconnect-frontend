"use client";

import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/connection/request/recevied`, {
        withCredentials: true,
      });

      const allRequests = res.data.connectionRequests || [];
      dispatch(addRequests(allRequests));
    } catch (error) {
      console.log("Fetch Requests Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept / Reject request
  const reviewRequest = async (status, fromUserId) => {
    try {
      await axios.post(
        `${BASE_URL}/Reviewrequest/${status}/${fromUserId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(fromUserId));
      setShowModal(false);
      setToastMsg(`✅ Request ${status} successfully`);
      setTimeout(() => setToastMsg(""), 3000);
    } catch (error) {
      console.log("Review Error:", error);
      setToastMsg("❌ Failed to update request");
      setTimeout(() => setToastMsg(""), 3000);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-96 text-xl text-gray-400">
        Loading requests...
      </div>
    );

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
          const user = req.FromUserId || {};
          const {
            _id,
            FirstName,
            LastName,
            PhotoUrl,
            Age,
            Gender,
            About,
            Skills = [],
          } = user;

          return (
            <div
              key={req._id}
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

              <div className="flex flex-col gap-2">
                <button
                  className="btn btn-outline btn-sm text-blue-400 border-blue-400 hover:bg-blue-500 hover:text-white"
                  onClick={() => {
                    setSelectedUser(user);
                    setShowModal(true);
                  }}
                >
                  👁️ View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Profile Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 text-white relative">
            <button
              className="absolute top-2 right-3 text-gray-400 hover:text-white"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <div className="flex flex-col items-center">
              <img
                src={selectedUser.PhotoUrl || "/placeholder.svg"}
                alt={selectedUser.FirstName}
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <h2 className="text-3xl font-bold mt-4">
                {selectedUser.FirstName} {selectedUser.LastName}
              </h2>
              {selectedUser.Age && selectedUser.Gender && (
                <p className="text-gray-400 text-sm mt-1">
                  {selectedUser.Age} • {selectedUser.Gender}
                </p>
              )}
              <p className="text-gray-300 text-center mt-3 px-4">
                {selectedUser.About || "No bio available"}
              </p>

              {/* ✅ Skills */}
              {selectedUser.Skills && selectedUser.Skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {selectedUser.Skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full text-sm font-semibold shadow-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  className="btn btn-success"
                  onClick={() =>
                    reviewRequest("accepted", selectedUser._id)
                  }
                >
                  ✅ Accept
                </button>
                <button
                  className="btn btn-error"
                  onClick={() =>
                    reviewRequest("rejected", selectedUser._id)
                  }
                >
                  ❌ Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
