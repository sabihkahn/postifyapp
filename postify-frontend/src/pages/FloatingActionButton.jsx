import React from "react";
import { FaPlus } from "react-icons/fa";

const FloatingActionButton = ({ onClick }) => {
  return (
    <button className="fab" onClick={onClick}>
      <FaPlus />
    </button>
  );
};

export default FloatingActionButton;