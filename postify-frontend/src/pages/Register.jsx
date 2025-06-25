import React, { useState } from "react";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";
const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    photo: null,
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setForm({ ...form, photo: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));

    try {
      const { data } = await axios.post("https://postifybackend.vercel.app/register", formData);
      alert("Registered Successfully ✅");
         navigate("/")
    } catch (err) {
      alert("Registration Failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-box">
        <h2 className="form-heading">Register</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="form-input"
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <input
            className="form-input"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
          />
          <button className="form-button" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
