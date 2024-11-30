import React, { useState, useEffect, useRef } from "react";
import Bird from "./Bird";
import Pipe from "./Pipe";
import Score from "./Score";
import Cloud from "./Cloud";
const Game = () => {
  const [birdTop, setBirdTop] = useState(200);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [stars, setStars] = useState([]);

  const birdVelocityRef = useRef(birdVelocity);
  const pipesRef = useRef(pipes);

  useEffect(() => {
    birdVelocityRef.current = birdVelocity;
    pipesRef.current = pipes;
  }, [birdVelocity, pipes]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    const gravity = 0.6;

    const gameLoop = setInterval(() => {
      if (!isGameOver) {
        setBirdVelocity((prev) => prev + gravity);

        // Clamp bird position
        setBirdTop((prev) =>
          Math.min(Math.max(prev + birdVelocityRef.current, 0), window.innerHeight - 50)
        );

        // Move pipes and remove off-screen pipes
        setPipes((prev) =>
          prev
            .map((pipe) => ({
              ...pipe,
              left: pipe.left - (5 + score * 0.1),
            }))
            .filter((pipe) => pipe.left > -50)
        );

        // Move stars and remove off-screen stars
        setStars((prev) =>
          prev
            .map((star) => ({
              ...star,
              left: star.left - (5 + score * 0.1),
            }))
            .filter((star) => star.left > -50)
        );

        // Check for collisions
        checkCollisions();
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [isGameOver, birdTop, score]);

  const checkCollisions = () => {
    const birdRect = {
      top: birdTop,
      left: 100,
      right: 150,
      bottom: birdTop + 50,
    };

    pipesRef.current.forEach((pipe) => {
      const pipeTopRect = {
        top: 0,
        left: pipe.left,
        right: pipe.left + 50,
        bottom: pipe.top,
      };
      const pipeBottomRect = {
        top: pipe.top + 150,
        left: pipe.left,
        right: pipe.left + 50,
        bottom: window.innerHeight,
      };

      if (
        (birdRect.right > pipeTopRect.left &&
          birdRect.left < pipeTopRect.right &&
          birdRect.bottom > pipeTopRect.top &&
          birdRect.top < pipeTopRect.bottom) ||
        (birdRect.right > pipeBottomRect.left &&
          birdRect.left < pipeBottomRect.right &&
          birdRect.bottom > pipeBottomRect.top &&
          birdRect.top < pipeBottomRect.bottom)
      ) {
        setIsGameOver(true);
      }
    });

    stars.forEach((star, index) => {
      if (
        birdRect.right > star.left &&
        birdRect.left < star.left + 40 &&
        birdRect.bottom > star.top &&
        birdRect.top < star.top + 40
      ) {
        setScore((prev) => prev + 5);
        setStars((prev) => prev.filter((_, i) => i !== index));
      }
    });
  };

  const handleSpacePress = () => {
    if (showSplash) {
      setShowSplash(false);
    } else if (!isGameOver) {
      setBirdVelocity(-10);
    } else {
      resetGame();
    }
  };

  const resetGame = () => {
    setBirdTop(200);
    setBirdVelocity(0);
    setPipes([]);
    setStars([]);
    setScore(0);
    setIsGameOver(false);
    setShowSplash(true);
  };

  const spawnPipe = () => {
    const top = Math.floor(Math.random() * (window.innerHeight - 200));
    setPipes((prev) => [
      ...prev,
      { top, left: window.innerWidth },
    ]);
    setScore((prev) => prev + 1);
  };

  const spawnStar = () => {
    const top = Math.floor(Math.random() * (window.innerHeight - 100));
    setStars((prev) => [
      ...prev,
      { top, left: window.innerWidth },
    ]);
  };

  useEffect(() => {
    const pipeInterval = setInterval(() => {
      if (!isGameOver && !showSplash) {
        spawnPipe();
        if (Math.random() > 0.7) spawnStar();
      }
    }, 2000);

    return () => clearInterval(pipeInterval);
  }, [isGameOver, showSplash]);

  return (
    <div
      className={`relative w-full h-screen overflow-hidden ${
        isDarkMode ? "bg-gradient-to-t from-gray-900 to-black" : "bg-gradient-to-t from-blue-500 to-cyan-300"
      }`}
      onClick={handleSpacePress}
    >
      {/* Dark Mode Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleTheme();
        }}
        className="absolute top-5 right-5 px-4 py-2 bg-white dark:bg-black text-black dark:text-white rounded shadow-lg"
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Splash Screen */}
      {showSplash && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <p className="text-4xl text-white mb-4">Get Ready!</p>
          <p className="text-xl text-white">Click or Tap to Start</p>
        </div>
      )}

      {/* Clouds */}
      {Array.from({ length: 5 }).map((_, index) => (
        <Cloud key={index} left={Math.random() * window.innerWidth} />
      ))}

      {/* Bird */}
      <Bird top={birdTop} />

      {/* Pipes */}
      {pipes.map((pipe, index) => (
        <React.Fragment key={index}>
          <Pipe top={0} left={pipe.left} height={pipe.top} />
          <Pipe
            top={pipe.top + 150}
            left={pipe.left}
            height={window.innerHeight - pipe.top - 150}
          />
        </React.Fragment>
      ))}

      {/* Score */}
      <Score score={score} />

      {/* Game Over Message */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
          <p className="text-4xl text-white mb-4">Game Over</p>
          <p className="text-2xl text-white mb-4">Final Score: {score}</p>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              resetGame();
            }}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
};

export default Game;
