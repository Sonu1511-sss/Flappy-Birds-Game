import React from "react";

const Bird = ({ top }) => {
  return (
    <div
      className="absolute w-20 h-20  transition-transform ease-in-out duration-200"
      style={{ top: `${top}px`, left: "50px" }}
    ><img src="public\bird.png" alt="" /></div>
  );
};

export default Bird;
