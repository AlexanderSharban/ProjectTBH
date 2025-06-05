"use client";

import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

const COLS = 6;
const ROWS = 17;
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1, 0]]  // S
];

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPos, setCurrentPos] = useState({x: 0, y: 0});
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  function createEmptyBoard() {
    return Array(ROWS).fill().map(() => Array(COLS).fill(0));
  }

  const spawnRandomPiece = useCallback(() => {
    const pieceIndex = Math.floor(Math.random() * SHAPES.length);
    const newPiece = {
      shape: SHAPES[pieceIndex],
      width: SHAPES[pieceIndex][0].length,
      height: SHAPES[pieceIndex].length
    };
    const startX = Math.floor((COLS - newPiece.width) / 2);
    const startY = -newPiece.height + 1; // Начинаем выше поля
    
    // Проверка на проигрыш (если после спавна фигура сразу сталкивается)
    if (checkCollision(newPiece, {x: startX, y: startY})) {
      setGameOver(true);
      return;
    }
    
    setCurrentPiece(newPiece);
    setCurrentPos({x: startX, y: startY});
  }, []);

  const rotatePiece = () => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotated = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    
    const newPiece = {
      shape: rotated,
      width: rotated[0].length,
      height: rotated.length
    };
    
    // Корректировка позиции при повороте у границ
    let newX = currentPos.x;
    if (currentPos.x + newPiece.width > COLS) {
      newX = COLS - newPiece.width;
    }
    
    if (!checkCollision(newPiece, {x: newX, y: currentPos.y})) {
      setCurrentPiece(newPiece);
      setCurrentPos(pos => ({...pos, x: newX}));
    }
  };

  const checkCollision = (piece, pos) => {
    for (let y = 0; y < piece.height; y++) {
      for (let x = 0; x < piece.width; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (
            newX < 0 || 
            newX >= COLS || 
            newY >= ROWS ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const movePiece = useCallback((direction) => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const newPos = {...currentPos};
    
    switch (direction) {
      case 'left':
        newPos.x--;
        break;
      case 'right':
        newPos.x++;
        break;
      case 'down':
        newPos.y++;
        break;
      default:
        break;
    }
    
    if (!checkCollision(currentPiece, newPos)) {
      setCurrentPos(newPos);
    } else if (direction === 'down') {
      lockPiece();
    }
  }, [currentPiece, currentPos, gameOver, isPaused]);

  const lockPiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = [...board];
    let touchedCeiling = false;
    
    for (let y = 0; y < currentPiece.height; y++) {
      for (let x = 0; x < currentPiece.width; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPos.y + y;
          const boardX = currentPos.x + x;
          
          if (boardY < 0) {
            // Фигура касается потолка
            touchedCeiling = true;
            continue;
          }
          
          if (boardY < ROWS) {
            newBoard[boardY][boardX] = 1; // 1 - упавшая зеленая фигура
          }
        }
      }
    }
    
    setBoard(newBoard);
    setCurrentPiece(null);
    
    if (touchedCeiling) {
      setGameOver(true);
    } else {
      checkLines();
      spawnRandomPiece();
    }
  }, [board, currentPiece, currentPos, spawnRandomPiece]);

  const checkLines = () => {
    const newBoard = [...board];
    let linesCleared = 0;
    
    for (let y = ROWS - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++; // Проверяем ту же позицию снова
      }
    }
    
    if (linesCleared > 0) {
      setBoard(newBoard);
      setScore(prev => prev + linesCleared * 100);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (gameOver) {
      if (e.key === ' ') {
        resetGame();
      }
      return;
    }
    
    if (e.key === 'p') {
      setIsPaused(prev => !prev);
      return;
    }
    
    if (isPaused) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        movePiece('left');
        break;
      case 'ArrowRight':
        movePiece('right');
        break;
      case 'ArrowDown':
        movePiece('down');
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      default:
        break;
    }
  }, [gameOver, isPaused, movePiece]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Автоматическое падение
  useEffect(() => {
    if (gameOver || isPaused || !currentPiece) return;
    
    const interval = setInterval(() => {
      movePiece('down');
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentPiece, gameOver, isPaused, movePiece]);

  // Инициализация игры
  useEffect(() => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setCurrentPiece(null);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    
    // Небольшая задержка перед спавном первой фигуры
    const timer = setTimeout(() => {
      spawnRandomPiece();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const resetGame = () => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    setCurrentPiece(null);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    
    // Небольшая задержка перед спавном первой фигуры
    setTimeout(() => {
      spawnRandomPiece();
    }, 100);
  };

  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.height; y++) {
        for (let x = 0; x < currentPiece.width; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPos.y + y;
            const boardX = currentPos.x + x;
            
            if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
              displayBoard[boardY][boardX] = 2; // 2 - текущая фигура
            }
          }
        }
      }
    }
    
    return (
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 30px)`,
        gridTemplateRows: `repeat(${ROWS}, 30px)`,
        gap: '2px',
        backgroundColor: '#00FFAA',
        padding: '5px',
        border: '3px solid #00FFAA',
        marginBottom: '20px'
      }}>
        {displayBoard.map((row, y) => 
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: cell === 0 ? '#0A192F' : cell === 1 ? '#00FFAA' : '#00FFAA',
                border: `1px solid ${cell === 0 ? '#0A192F' : '#00FFAA'}`,
                opacity: cell === 2 ? 0.8 : 1
              }}
            />
          ))
        )}
      </div>
    );
  };
      <Head>
        <title>Тетрис</title>
        <meta name="description" content="Игра Тетрис на React" />
      </Head>
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
        Тетрис
      </h1>
      
      <div style={{ 
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        Счет: {score}
      </div>
      
      {isPaused && !gameOver && (
        <div style={{
          position: 'absolute',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: '20px',
          borderRadius: '10px',
          zIndex: 100,
          color: '#00FFAA',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          ПАУЗА
        </div>
      )}
      
      {renderBoard()}
      
      <div style={{ 
        marginBottom: '20px', 
        textAlign: 'center'
      }}>
        <p>Управление: ← → ↓, ↑ - поворот</p>
        <p>P - пауза, Пробел - новая игра</p>
      </div>
      
      {gameOver && (
        <div style={{ 
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '20px',
          textAlign: 'center',
          border: '2px solid #FF0000'
        }}>
          <h2 style={{ color: '#FF0000', marginBottom: '10px' }}>Игра окончена!</h2>
          <p style={{ marginBottom: '15px' }}>Фигура коснулась потолка</p>
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
            Новая игра (Пробел)
          </button>
        </div>
      )}
    </div>
  );      
}
