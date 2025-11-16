"use client";
import axios from "axios";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";

const EditProfile = () => {
  const user = useSelector((store) => store.user);

  const [formData, setFormData] = useState({
    FirstName: user?.FirstName || "",
    LastName: user?.LastName || "",
    Age: user?.Age || "",
    Gender: user?.Gender || "",
    About: user?.About || "",
    Skills: user?.Skills?.join(", ") || "",
    PhotoUrl: user?.PhotoUrl || "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      const payload = {
        ...formData,
        Skills: formData.Skills
          ? formData.Skills.split(",").map((s) => s.trim())
          : [],
      };

      const res = await axios.put(`${BASE_URL}/profile/edit`, payload, {
        withCredentials: true,
      });

      // Update Redux user correctly
      dispatch(addUser({ ...res.data.data }));

      // 🔥 Sync updated user to localStorage (so UI loads correct data after refresh)
      localStorage.setItem("user", JSON.stringify(res.data.data));

      alert(res.data.message);
      navigate("/profile", { replace: true });
    } catch (error) {
      console.log("Profile update error:", error);
      alert(error?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center my-10 gap-4">
      <h2 className="text-3xl font-bold text-white">Edit Your Profile</h2>

      <div className="bg-base-200 p-6 rounded-lg shadow-md w-96 space-y-3">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="block text-sm text-gray-400 mb-1">{key}</label>
            <input
              name={key}
              value={formData[key]}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        ))}

        <button onClick={handleSave} className="btn btn-primary w-full mt-3">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
