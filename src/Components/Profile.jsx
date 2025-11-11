"use client";
import { useSelector } from "react-redux";
import ProfileView from "./ProfileView";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  if (!user)
    return <h2 className="text-center mt-10 text-gray-400">Loading...</h2>;

  return (
    <div className="flex flex-col items-center my-10 gap-6">
      <ProfileView viewedUser={user} />

      <button
        className="btn btn-primary px-6 mt-4"
        onClick={() => navigate("/profile/edit")}
      >
        ✏️ Edit Profile
      </button>
    </div>
  );
};

export default Profile;
