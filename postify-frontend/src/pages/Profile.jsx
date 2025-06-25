import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaHeart, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

// Convert nested user photo buffer to base64
const bufferToBase64User = (photoObj) => {
  try {
    const byteArray = photoObj?.data?.data;
    const contentType = photoObj?.contentType || "image/jpeg";
    if (!byteArray || !Array.isArray(byteArray)) return null;
    const binaryString = byteArray.map((b) => String.fromCharCode(b)).join("");
    const base64 = window.btoa(binaryString);
    return `data:${contentType};base64,${base64}`;
  } catch (err) {
    return null;
  }
};

// For post photo (already in base64)
const bufferToBase64Post = (photoObj) => {
  try {
    if (!photoObj?.data || !photoObj?.contentType) return null;
    return `data:${photoObj.contentType};base64,${photoObj.data}`;
  } catch {
    return null;
  }
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const rawPosts = localStorage.getItem("myPosts");

    if (!rawUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(rawUser);
    const userObj = userData.user;
    setUser(userObj);

    if (rawPosts) {
      const allPosts = JSON.parse(rawPosts);
      const filtered = allPosts.filter((post) => post.creator === userObj._id);
      setUserPosts(filtered);
    }
  }, []);

  if (!user) return <p style={{ color: "#fff" }}>Loading profile…</p>;

  const totalLikes = userPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
  const totalFollowers = userPosts.reduce((sum, p) => sum + (p.followers || 0), 0);
  const profilePhoto = bufferToBase64User(user.photo);

  const filterStyles = {
    none: "",
    grayscale: "grayscale(100%)",
    sepia: "sepia(100%)",
    brightness: "brightness(1.2)",
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        {profilePhoto ? (
          <img src={profilePhoto} alt="User Avatar" style={styles.avatar} />
        ) : (
          <div style={styles.avatarFallback}>Can't Load</div>
        )}
        <div>
          <h2><FaUser /> {user.name || "No name"}</h2>
          <p><FaEnvelope /> {user.email || "No email"}</p>
          <p><FaUserFriends /> {totalFollowers} Followers</p>
          <p><FaHeart /> {totalLikes} Likes</p>
          <Link to="/">
            <button className="back">Back</button>
          </Link>
        </div>
      </div>

      <div style={styles.grid}>
        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div key={post._id} style={styles.card}>
              {post.photo ? (
                <img
                  src={bufferToBase64Post(post.photo)}
                  alt={post.title}
                  style={{
                    ...styles.image,
                    filter: post.filter ? filterStyles[post.filter] : "",
                  }}
                />
              ) : (
                <div style={styles.imageFallback}>Can't Load</div>
              )}
              <div style={styles.info}>
                <h4>{post.title}</h4>
                <p>{post.description}</p>
                <div style={styles.stats}>
                  <span><FaHeart /> {post.likes}</span>
                  <span><FaUserFriends /> {post.followers}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "2rem",
    fontFamily: "Segoe UI, sans-serif",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid hotpink",
  },
  avatarFallback: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    background: "#111",
    color: "#aaa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    border: "2px solid hotpink",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "1rem",
  },
  card: {
    background: "#111",
    borderRadius: "12px",
    overflow: "hidden",
    transition: "transform 0.3s",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    transition: "filter 0.3s",
  },
  imageFallback: {
    height: "180px",
    background: "#222",
    color: "#999",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    padding: "0.75rem",
  },
  stats: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.85rem",
    marginTop: "0.5rem",
  },
};

export default Profile;
