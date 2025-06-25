import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState("none");
  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))?.user;

  useEffect(() => {
    const raw = localStorage.getItem("user");
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token) {
        setToken(parsed.token);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !user) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("creator", user._id);
    formData.append("likes", 0);
    formData.append("followers", 0);
    formData.append("filter", filter);

    try {
      await axios.post("https://postifybackend.vercel.app/uplodimg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Save post in localStorage
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const base64data = reader.result;
        const post = {
          _id: Date.now(),
          title,
          description,
          likes: 0,
          followers: 0,
          creator: user._id,
          photo: {
            data: base64data.split(",")[1],
            contentType: file.type,
          },
          filter,
        };

        const oldPosts = JSON.parse(localStorage.getItem("myPosts")) || [];
        localStorage.setItem("myPosts", JSON.stringify([post, ...oldPosts]));

        setIsUploading(false);
        navigate("/");
      };
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload. Try again later.");
      setIsUploading(false);
    }
  };

  const filters = {
    none: "None",
    grayscale: "Grayscale",
    sepia: "Sepia",
    brightness: "Bright",
  };

  const filterStyles = {
    none: "",
    grayscale: "grayscale(100%)",
    sepia: "sepia(100%)",
    brightness: "brightness(1.2)",
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✨ Create New TikTok Post ✨</h2>

      {!preview ? (
        <label htmlFor="file-upload" style={styles.uploadLabel}>
          <p>📷 Click to select photo</p>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>
      ) : (
        <div style={styles.previewContainer}>
          <img
            src={preview}
            alt="Preview"
            style={{ ...styles.imagePreview, filter: filterStyles[filter] }}
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.select}
          >
            {Object.keys(filters).map((key) => (
              <option key={key} value={key}>
                {filters[key]}
              </option>
            ))}
          </select>
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={styles.input}
        />
        <textarea
          placeholder="Write a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...styles.input, height: "80px" }}
        />
        {preview && (
          <button type="submit" disabled={isUploading} style={styles.button}>
            {isUploading ? "Uploading..." : "Share Post 🚀"}
          </button>
        )}
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{ ...styles.button, backgroundColor: "#222" }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "2rem",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    animation: "fadeIn 0.8s ease",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "2rem",
    color: "hotpink",
  },
  uploadLabel: {
    background: "#111",
    padding: "2rem",
    border: "2px dashed #555",
    borderRadius: "10px",
    color: "#aaa",
    cursor: "pointer",
    marginBottom: "2rem",
    textAlign: "center",
    transition: "all 0.3s",
  },
  previewContainer: {
    textAlign: "center",
    marginBottom: "1rem",
  },
  imagePreview: {
    width: "250px",
    height: "350px",
    borderRadius: "10px",
    objectFit: "cover",
    marginBottom: "1rem",
    border: "2px solid hotpink",
    transition: "filter 0.3s",
  },
  select: {
    background: "#111",
    color: "white",
    padding: "0.5rem",
    borderRadius: "5px",
    border: "1px solid #444",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: "0.8rem",
    border: "1px solid #333",
    borderRadius: "6px",
    outline: "none",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "hotpink",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background 0.3s",
  },
};

export default Upload;
