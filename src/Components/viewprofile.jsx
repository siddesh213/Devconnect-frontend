import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileView = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();

  if (!user) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl p-5">

        <h2 className="card-title justify-center mb-3">
          {user.FirstName} {user.LastName}
        </h2>

        <p><b>Age:</b> {user.Age || "Not set"}</p>
        <p><b>Gender:</b> {user.Gender || "Not set"}</p>
        <p><b>About:</b> {user.About || "No bio added yet"}</p>

        <p><b>Skills:</b></p>
        <div className="flex flex-wrap gap-2 mb-3">
          {user.Skills?.length > 0
            ? user.Skills.map((skill, i) => (
                <span key={i} className="badge badge-secondary">{skill}</span>
              ))
            : "No skills added"}
        </div>

        <button
          className="btn btn-primary w-full"
          onClick={() => navigate("/app/profile/edit")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
