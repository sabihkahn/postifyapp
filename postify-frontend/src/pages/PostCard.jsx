import React, { useState } from "react";
import axios from "axios";
import { FaHeart, FaComment, FaShare, FaUserCircle } from "react-icons/fa";

const PostCard = ({ post, onCommentClick }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followCount, setFollowCount] = useState(post.followers || 0);

  const handleLike = async () => {
    try {
      await axios.post(`https://postifybackend.vercel.app/like/${post._id}`);
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleFollow = async () => {
    try {
      await axios.post(`https://postifybackend.vercel.app/follow/${post._id}`);
      setIsFollowing(!isFollowing);
      setFollowCount(isFollowing ? followCount - 1 : followCount + 1);
    } catch (error) {
      console.error("Error following post:", error);
    }
  };

  // Safely get image URL
  const getImageUrl = (imageData) => {
    if (!imageData || !imageData.data) return null;
    
    try {
      // Check if data is already a base64 string
      if (typeof imageData.data === 'string') {
        return `data:${imageData.contentType};base64,${imageData.data}`;
      }
      
      // Handle buffer data
      const bytes = new Uint8Array(imageData.data.data || imageData.data);
      const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
      return `data:${imageData.contentType};base64,${window.btoa(binary)}`;
    } catch (error) {
      console.error("Error processing image:", error);
      return null;
    }
  };

  const postImageUrl = getImageUrl(post.photo);
  const creatorImageUrl = post.creatorPhoto ? getImageUrl(post.creatorPhoto) : null;

  if (!postImageUrl) {
    return <div className="post-card error">Error loading post</div>;
  }

  return (
    <div className="post-card">
      <div className="post-header">
        {creatorImageUrl ? (
          <img 
            src={creatorImageUrl}
            alt="creator" 
            className="creator-avatar"
          />
        ) : (
          <FaUserCircle className="creator-avatar default" />
        )}
        <span className="creator-name">{post.name || "Anonymous"}</span>
      </div>

      <img
        src={postImageUrl}
        alt="post"
        className="post-image"
      />

      <div className="post-actions">
        <button 
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <FaHeart className="icon" />
          <span>{likeCount}</span>
        </button>

        <button className="action-btn" onClick={onCommentClick}>
          <FaComment className="icon" />
          <span>{post.comments?.length || 0}</span>
        </button>

        <button 
          className={`action-btn ${isFollowing ? "following" : ""}`}
          onClick={handleFollow}
        >
          <FaUserCircle className="icon" />
          <span>{followCount}</span>
        </button>
      </div>

      <div className="post-info">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-description">{post.description}</p>
      </div>
    </div>
  );
};

export default PostCard;