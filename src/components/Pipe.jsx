import React from "react";

const Pipe = ({ top, left, height }) => {
  return (
    <div
      className="absolute"
      style={{
        background: "linear-gradient(to bottom, #4caf50, #2e7d32)",
        width: "50px",
        height: `${height}px`,
        left: `${left}px`,
        border: "2px solid #388e3c",
        boxShadow: "2px 2px 8px rgba(0,0,0,0.5)",
        transition: "all ease-linear 200ms",
      }}
    ></div>
  );
};

export default Pipe;
