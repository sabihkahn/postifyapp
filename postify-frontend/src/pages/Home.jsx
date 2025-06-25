import React, { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import CommentSection from "./CommentSection";
import FloatingActionButton from "./FloatingActionButton";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [activePost, setActivePost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 🔐 Redirect to login if not logged in
  useEffect(() => {
    const raw = localStorage.getItem("user");
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token && parsed?.user) {
        setUser(parsed.user);
      } else {
        navigate("/login");
      }
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("https://postifybackend.vercel.app/getallpost");
      setPosts(data.posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleComments = (post) => {
    setActivePost(post);
    setShowComments(!showComments);
  };

  const profilePic = user?.photo?.data?.data
    ? `data:${user.photo.contentType};base64,${btoa(
        new Uint8Array(user.photo.data.data)
          .reduce((acc, byte) => acc + String.fromCharCode(byte), "")
      )}`
    : null;

  return (
    <div className="home-container">
      <div className="top-bar">
        <h2 className="logo">Postify</h2>
        <div className="top-right">
          <Link to={`/profile/${user?._id}`} className="profile-link">
            {profilePic ? (
              <img src={profilePic} className="profile-pic" alt="profile" />
            ) : (
              <i className="fas fa-user-circle profile-icon"></i>
            )}
          </Link>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <div className="post-feed">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onCommentClick={() => toggleComments(post)} />
        ))}
      </div>

      {showComments && activePost && (
        <CommentSection post={activePost} onClose={() => setShowComments(false)} />
      )}

      <FloatingActionButton onClick={() => navigate("/upload")} />
    </div>
  );
};

export default Home;
