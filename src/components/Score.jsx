import React from "react";

const Score = ({ score }) => {
  return (
    <div className="absolute top-5 left-5 text-4xl font-extrabold text-yellow-500 drop-shadow-md">
      Score: {score}
    </div>
  );
};

export default Score;
