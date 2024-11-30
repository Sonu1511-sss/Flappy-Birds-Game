import React from "react";

const Cloud = ({ left }) => (
  <div
    className="absolute bg-white opacity-50 rounded-full w-20 h-10"
    style={{
      top: `${Math.random() * 300}px`,
      left: `${left}px`,
      filter: "blur(4px)",
    }}
  ></div>
);

export default Cloud;
