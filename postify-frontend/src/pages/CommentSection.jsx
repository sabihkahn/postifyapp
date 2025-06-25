import React, { useState } from "react";
import axios from "axios";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

const CommentSection = ({ post, onClose }) => {
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const { data } = await axios.post(
        `https://postifybackend.vercel.app/postcomment/${post._id}`,
        { text: newComment }
      );
      setComments(data.post.comments);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>Comments ({comments.length})</h3>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-user">
                <div className="user-avatar"></div>
                <span className="username">User</span>
              </div>
              <p className="comment-text">{comment.text}</p>
              <span className="comment-time">
                {new Date(comment.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button type="submit">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default CommentSection;