import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    gender: "",
    dob: "",
    current_password: "",
    new_password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      navigate("/auth/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/auth/login");
        return;
      }
    } catch (err) {
      setError("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      navigate("/auth/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://api.intellihelper.tech/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile(response.data);
        setFormData({
          name: response.data.name,
          username: response.data.username,
          gender: response.data.gender,
          dob: response.data.dob,
          current_password: "",
          new_password: "",
        });
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const updateData = {
        name: formData.name,
        username: formData.username,
        gender: formData.gender,
        dob: formData.dob,
      };

      if (formData.current_password && formData.new_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }

      const response = await axios.put("https://api.intellihelper.tech/profile/update", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      setProfile((prevProfile) => ({ ...prevProfile, ...updateData }));
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update profile.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/auth/login");
  };

  if (error) return <p className="text-red-600 text-center mt-4">{error}</p>;
  if (!profile) return <p className="text-center mt-4">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>
      <div className="flex justify-center mb-6">
        <img
          src={profile.profile_picture}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Date of Birth:</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <hr className="my-4" />

          <h3 className="text-lg font-semibold">Change Password (Optional)</h3>

          <div>
            <label className="block text-sm font-medium">Current Password:</label>
            <input
              type="password"
              name="current_password"
              value={formData.current_password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">New Password:</label>
            <input
              type="password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Gender:</strong> {profile.gender}</p>
          <p><strong>Date of Birth:</strong> {profile.dob}</p>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
