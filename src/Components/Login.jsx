"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔁 Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/feed");
    }
  }, [user]);

  const validate = () => {
    if (!emailId || !password || (!isLoginForm && (!firstName || !lastName))) {
      setError("Please fill all required fields");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        { EmailId: emailId, PassWord: password },
        { withCredentials: true }
      );

      console.log("✅ Login response:", res.data);

      // ✅ FIX — backend sends user object directly
      if (res.data && res.data._id) {
        dispatch(addUser(res.data));
        navigate("/feed"); // ✅ correct route
      } else {
        setError("Login successful but no user data received.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        {
          FirstName: firstName,
          LastName: lastName,
          EmailId: emailId,
          PassWord: password,
        },
        { withCredentials: true }
      );

      console.log("✅ Signup response:", res.data);
      dispatch(addUser(res.data)); // ✅ direct user object
      navigate("/feed");
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginForm ? "Login" : "Signup"}
          </h2>

          <div>
            {!isLoginForm && (
              <>
                <label className="form-control w-full max-w-xs my-2">
                  <span className="label-text">First Name</span>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>

                <label className="form-control w-full max-w-xs my-2">
                  <span className="label-text">Last Name</span>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
              </>
            )}

            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Email</span>
              <input
                type="email"
                value={emailId}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full max-w-xs my-2">
              <span className="label-text">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <div className="card-actions justify-center mt-3">
            <button
              className="btn btn-primary"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLoginForm
                ? "Login"
                : "Signup"}
            </button>
          </div>

          <p
            className="text-center cursor-pointer py-2 text-blue-500"
            onClick={() => {
              setIsLoginForm(!isLoginForm);
              setError("");
            }}
          >
            {isLoginForm
              ? "New user? Signup here"
              : "Existing user? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
