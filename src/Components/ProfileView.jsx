"use client";

const ProfileView = ({ viewedUser }) => {
  if (!viewedUser) return null;

  return (
    <div className="card bg-base-200 w-80 shadow-lg p-5 text-center">
      <img
        src={viewedUser.PhotoUrl || "/placeholder.svg"}
        alt="User"
        className="rounded-lg w-32 h-32 object-cover mx-auto"
      />

      <h3 className="text-xl font-semibold mt-3">
        {viewedUser.FirstName} {viewedUser.LastName}
      </h3>

      {viewedUser.Age && viewedUser.Gender && (
        <p className="text-gray-500">{viewedUser.Age} • {viewedUser.Gender}</p>
      )}

      <p className="text-gray-400 mt-2">
        {viewedUser.About || "No description available"}
      </p>

      {viewedUser.Skills?.length > 0 && (
        <div className="flex gap-2 justify-center mt-3 flex-wrap">
          {viewedUser.Skills.map((skill, i) => (
            <span
              key={i}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 text-xs rounded-full text-white shadow-md"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileView;
