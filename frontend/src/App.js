import React, { useEffect, useRef } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GRAVITY = 0.6;
const JUMP_FORCE = -14;
const OBSTACLE_SPEED = 6;

const DINO_WIDTH = 80;
const DINO_HEIGHT = 80;

const OBSTACLE_BASE_WIDTH = 60; // or 50 or 60 — your choice
const OBSTACLE_ASPECT_RATIO = 30 / 37; // height / width

const OBSTACLE_WIDTH = OBSTACLE_BASE_WIDTH;
const OBSTACLE_HEIGHT = OBSTACLE_WIDTH * OBSTACLE_ASPECT_RATIO;
function App() {
  const canvasRef = useRef(null);
  const playerY = useRef(GAME_HEIGHT - DINO_HEIGHT);
  const velocityY = useRef(0);
  const isJumping = useRef(false);
  const obstacles = useRef([{ x: GAME_WIDTH, y: GAME_HEIGHT - 40, scored: false }]);
  const score = useRef(0);

  const jump = () => {
    if (!isJumping.current) {
      velocityY.current = JUMP_FORCE;
      isJumping.current = true;
    }
  };
let nextObstacleX = GAME_WIDTH + Math.random() * 200 + 200; // First one after 200–400px

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const dino = new Image();
    dino.src = '/dino.png';

    const obstacleImg = new Image();
    obstacleImg.src = '/obstacle.png';

    const gameLoop = () => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Update player Y position
      velocityY.current += GRAVITY;
      playerY.current += velocityY.current;

      if (playerY.current > GAME_HEIGHT - DINO_HEIGHT) {
        playerY.current = GAME_HEIGHT - DINO_HEIGHT;
        velocityY.current = 0;
        isJumping.current = false;
      }

      // Draw player
      ctx.drawImage(dino, 50, playerY.current, DINO_WIDTH, DINO_HEIGHT);

      // Move and draw obstacles
      obstacles.current.forEach((obs) => {
        obs.x -= OBSTACLE_SPEED;

ctx.drawImage(obstacleImg, obs.x, obs.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);

        // ✅ Increase score if obstacle passed and not already scored
        if (!obs.scored && obs.x + 40 < 50) {
          score.current += 1;
          obs.scored = true;
        }

        // 💥 Collision detection
        if (
  obs.x < 50 + DINO_WIDTH &&         // Right side of dino
  obs.x + OBSTACLE_WIDTH > 50 &&
  playerY.current + DINO_HEIGHT > obs.y  // Bottom of dino touches top of obstacle
) {
          alert(`Game Over! Final Score: ${score.current}`);
          // Reset game
          playerY.current = GAME_HEIGHT - 50;
          velocityY.current = 0;
          isJumping.current = false;
          obstacles.current = [{ x: GAME_WIDTH, y: GAME_HEIGHT - 40, scored: false }];
          score.current = 0;
        }
      });

      // Add new obstacle if needed
      // Add new obstacle when the last one crosses the random threshold
if (
  obstacles.current.length === 0 ||
  obstacles.current[obstacles.current.length - 1].x < nextObstacleX
) {
  obstacles.current.push({
    x: GAME_WIDTH,
    y: GAME_HEIGHT - OBSTACLE_HEIGHT,
    scored: false
  });

  // Set a new randomized threshold (between 200 and 500 px)
  nextObstacleX = Math.random() * 300 + 200;
}


      // Remove off-screen obstacles
      obstacles.current = obstacles.current.filter(obs => obs.x > -50);

      // Draw score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${score.current}`, GAME_WIDTH - 140, 30);

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
  }, []);

 return (
  <div
    style={{
      textAlign: 'center',
      marginTop: 20,
      backgroundImage: 'url("/background.png")', // path to your image
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}
  >
    <h1>Pengie Jump!!</h1>
    <canvas
      ref={canvasRef}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      style={{
        border: '1px solid #000',
        backgroundColor: '#d6f4ff' // or transparent
      }}
      onClick={jump}
    />
    <p>Click on the game to jump!</p>
  </div>
);

}

export default App;
