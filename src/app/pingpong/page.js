"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const GAME_WIDTH = 800;
const GAME_HEIGHT = 500;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_MARGIN = 30;
const BALL_SPEED = 3;
const PADDLE_SPEED = 8;

export default function PongGame() {
  const [player1Y, setPlayer1Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [player2Y, setPlayer2Y] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
  const [ballPos, setBallPos] = useState({
    x: GAME_WIDTH / 2 - BALL_SIZE / 2,
    y: GAME_HEIGHT / 2 - BALL_SIZE / 2
  });
  const [ballDir, setBallDir] = useState({ x: 1, y: 1 });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const gameLoopRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted) {
        setGameStarted(true);
        return;
      }

      if (e.key.toLowerCase() === 'w') {
        setPlayer1Y(prev => Math.max(0, prev - PADDLE_SPEED));
      } else if (e.key.toLowerCase() === 's') {
        setPlayer1Y(prev => Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prev + PADDLE_SPEED));
      }
      
      if (e.key === 'ArrowUp') {
        setPlayer2Y(prev => Math.max(0, prev - PADDLE_SPEED));
      } else if (e.key === 'ArrowDown') {
        setPlayer2Y(prev => Math.min(GAME_HEIGHT - PADDLE_HEIGHT, prev + PADDLE_SPEED));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted]);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setBallPos(prev => {
      let newX = prev.x + ballDir.x * BALL_SPEED;
      let newY = prev.y + ballDir.y * BALL_SPEED;
      let newDirX = ballDir.x;
      let newDirY = ballDir.y;

      // Отскок от верхней и нижней границы
      if (newY <= 0 || newY >= GAME_HEIGHT - BALL_SIZE) {
        newDirY = -newDirY;
      }

      // Проверка на гол (левая граница)
      if (newX <= 0) {
        setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
        resetBall(1);
        return { x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2 };
      }
      
      // Проверка на гол (правая граница)
      if (newX >= GAME_WIDTH - BALL_SIZE) {
        setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
        resetBall(-1);
        return { x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2 };
      }

      // Проверка столкновения с левой ракеткой
      if (
        newX <= PADDLE_MARGIN + PADDLE_WIDTH && 
        newY + BALL_SIZE >= player1Y && 
        newY <= player1Y + PADDLE_HEIGHT
      ) {
        const hitPosition = (newY - player1Y) / PADDLE_HEIGHT;
        const bounceAngle = hitPosition * 2 - 1;
        newDirX = 1;
        newDirY = bounceAngle * 1.5;
      }
      
      // Проверка столкновения с правой ракеткой
      if (
        newX >= GAME_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE && 
        newY + BALL_SIZE >= player2Y && 
        newY <= player2Y + PADDLE_HEIGHT
      ) {
        const hitPosition = (newY - player2Y) / PADDLE_HEIGHT;
        const bounceAngle = hitPosition * 2 - 1;
        newDirX = -1;
        newDirY = bounceAngle * 1.5;
      }

      if (newDirX !== ballDir.x || newDirY !== ballDir.y) {
        setBallDir({ x: newDirX, y: newDirY });
      }

      return { x: newX, y: newY };
    });
  }, [gameStarted, gameOver, ballDir, player1Y, player2Y]);

  const resetBall = (direction) => {
    setBallDir({ 
      x: direction, 
      y: Math.random() > 0.5 ? 0.5 : -0.5
    });
    setGameStarted(false);
  };

  useEffect(() => {
    gameLoopRef.current = gameLoop;
  }, [gameLoop]);

  useEffect(() => {
    const animate = () => {
      gameLoopRef.current();
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const resetGame = () => {
    setScore({ player1: 0, player2: 0 });
    setPlayer1Y(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setPlayer2Y(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2);
    setBallPos({
      x: GAME_WIDTH / 2 - BALL_SIZE / 2,
      y: GAME_HEIGHT / 2 - BALL_SIZE / 2
    });
    setBallDir({ x: 1, y: 0.5 });
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0A192F',
      padding: '20px',
      color: '#00FFAA'
    }}>
      <h1 style={{ 
        color: '#00FFAA',
        marginBottom: '20px',
        textAlign: 'center',
        textShadow: '0 0 5px #00FFAA'
      }}>
        Pong (2 Players)
      </h1>

      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        width: `${GAME_WIDTH}px`,
        marginBottom: '10px',
        fontSize: '24px',
        fontWeight: 'bold'
      }}>
        <div>Player 1 (W/S): {score.player1}</div>
        <div>Player 2 (↑/↓): {score.player2}</div>
      </div>

      <div style={{
        position: 'relative',
        width: `${GAME_WIDTH}px`,
        height: `${GAME_HEIGHT}px`,
        backgroundColor: '#0A192F',
        border: '3px solid #00FFAA',
        marginBottom: '20px'
      }}>
        {/* Player 1 (left paddle) */}
        <div style={{
          position: 'absolute',
          left: `${PADDLE_MARGIN}px`,
          top: `${player1Y}px`,
          width: `${PADDLE_WIDTH}px`,
          height: `${PADDLE_HEIGHT}px`,
          backgroundColor: '#00FFAA',
          borderRadius: '5px'
        }} />

        {/* Player 2 (right paddle) */}
        <div style={{
          position: 'absolute',
          right: `${PADDLE_MARGIN}px`,
          top: `${player2Y}px`,
          width: `${PADDLE_WIDTH}px`,
          height: `${PADDLE_HEIGHT}px`,
          backgroundColor: '#00FFAA',
          borderRadius: '5px'
        }} />

        {/* Ball */}
        <div style={{
          position: 'absolute',
          left: `${ballPos.x}px`,
          top: `${ballPos.y}px`,
          width: `${BALL_SIZE}px`,
          height: `${BALL_SIZE}px`,
          backgroundColor: '#00FFAA',
          borderRadius: '50%'
        }} />

        {/* Center line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          width: '2px',
          height: '100%',
          backgroundColor: 'rgba(0, 255, 170, 0.3)',
          transform: 'translateX(-1px)'
        }} />

        {!gameStarted && !gameOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#00FFAA',
            fontSize: '24px',
            textAlign: 'center'
          }}>
            <p>Press any key to start</p>
            <p>Player 1: W/S keys</p>
            <p>Player 2: Arrow keys</p>
          </div>
        )}

        {gameOver && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#FF0000',
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Game Over!
          </div>
        )}
      </div>

      <div style={{ 
        marginBottom: '20px', 
        textAlign: 'center'
      }}>
        <p>Player 1 controls: W (up), S (down)</p>
        <p>Player 2 controls: ↑ (up), ↓ (down)</p>
      </div>

      <button
        onClick={resetGame}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0A192F',
          color: '#00FFAA',
          border: '2px solid #00FFAA',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#00FFAA'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#0A192F'}
      >
        Reset Game
      </button>
    </div>
  );
}