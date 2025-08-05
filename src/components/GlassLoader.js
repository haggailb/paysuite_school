// // components/GlassLoader.js
// import React from "react";
// import { FaSpinner } from "react-icons/fa";
// import "./styles/GlassLoader.css";

// const GlassLoader = ({ show }) => {
//   return (
//     <div className={`glass-loader-overlay ${show ? "show" : "hide"}`}>
//       <div className="glass-loader-spinner">
//         <FaSpinner className="spinner-icon" />
//         <span className="ms-2">Processing, Please Wait...</span>
//       </div>
//     </div>
//   );
// };

// export default GlassLoader;
// components/GlassLoader.js

import React, { useEffect, useState, useRef } from "react";
import "./styles/GlassLoader.css";

const GlassLoader = ({ show }) => {
  const [balls, setBalls] = useState([]);
  const spinnerRef = useRef(null);
  const animationRef = useRef(null);

  // FLOATING BALLS
  useEffect(() => {
    if (!show) {
      setBalls([]);
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const newBalls = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 10 + Math.random() * 30,
      duration: 6 + Math.random() * 4,
      delay: Math.random() * 3,
    }));

    setBalls(newBalls);
  }, [show]);

  // BOUNCING TEXT
  useEffect(() => {
    if (!show) return;

    let posX = 100;
    let posY = 100;
    let velocityX = 1;
    let velocityY = 1;
    const speed = 2;

    const move = () => {
      const spinner = spinnerRef.current;
      if (!spinner) return;

      const { width, height } = spinner.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Bounce logic
      if (posX + width >= screenWidth || posX <= 0) velocityX *= -1;
      if (posY + height >= screenHeight || posY <= 0) velocityY *= -1;

      posX += velocityX * speed;
      posY += velocityY * speed;

      spinner.style.left = `${posX}px`;
      spinner.style.top = `${posY}px`;

      animationRef.current = requestAnimationFrame(move);
    };

    animationRef.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationRef.current);
  }, [show]);

  return (
    <div className={`glass-loader-overlay ${show ? "show" : "hide"}`}>
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="loader-ball morphing drifting"
          style={{
            left: `${ball.left}%`,
            top: `${ball.top}%`,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            animationDelay: `${ball.delay}s`,
            animationDuration: `${ball.duration}s, ${ball.duration + 2}s`,
          }}
        ></div>
      ))}

      <div className="glass-loader-spinner bouncing" ref={spinnerRef}>
        <span>Processing, Please Wait...</span>
      </div>
    </div>
  );
};


export default GlassLoader;
