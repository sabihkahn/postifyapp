import React, { useState } from "react";
import axios from "axios";
import { Navigate,useNavigate } from "react-router-dom";
const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      const { data } = await axios.post("https://postifybackend.vercel.app/login", formData);
      alert("Login successful ✅");
      navigate("/")
      
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      alert("Login failed ❌");
      console.log(err);
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-box">
        <h2 className="form-heading">Login</h2>
        <form className="form" onSubmit={handleSubmit}>
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
          <button className="form-button" type="submit">
            Login
          </button>
          <button className="form-button" onClick={()=> navigate("/register")}>
            Don't have an account? Register now
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
