"use client";

import { useState, useEffect } from "react";
import Head from "next/head";

export default function Minesweeper() {
  const width = 10;
  const bombAmount = 20;
  const [squares, setSquares] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  function createBoard(firstClickIndex = null) {
    let bombsArray = Array(bombAmount).fill("bomb");
    let emptyArray = Array(width * width - bombAmount).fill("empty");
    let gameArray = [...bombsArray, ...emptyArray];
    
    if (firstClickIndex !== null) {
      gameArray = gameArray.filter((_, index) => index !== firstClickIndex);
      gameArray.sort(() => Math.random() - 0.5);
      gameArray.splice(firstClickIndex, 0, "empty");
    } else {
      gameArray.sort(() => Math.random() - 0.5);
    }

    let board = [];
    for (let i = 0; i < width * width; i++) {
      board.push({ 
        id: i, 
        type: gameArray[i], 
        revealed: false, 
        flagged: false,
        adjacent: 0
      });
    }

    for (let i = 0; i < board.length; i++) {
      if (board[i].type === "bomb") continue;
      
      let total = 0;
      const neighbors = [
        i - 1, i + 1,
        i - width, i + width,
        i - width - 1, i - width + 1,
        i + width - 1, i + width + 1
      ];
      
      neighbors.forEach(pos => {
        if (pos >= 0 && pos < width * width && 
            board[pos]?.type === "bomb" &&
            Math.abs(pos % width - i % width) <= 1) {
          total++;
        }
      });

      board[i].adjacent = total;
    }

    setSquares(board);
  }

  function click(index) {
    if (isGameOver || squares[index]?.flagged) return;
    
    if (!gameStarted) {
      setGameStarted(true);
      createBoard(index);
      return;
    }

    const newSquares = [...squares];
    const square = newSquares[index];
    
    if (square.revealed) return;
    
    square.revealed = true;

    if (square.type === "bomb") {
      gameOver();
    } else if (square.adjacent === 0) {
      revealAdjacent(index, newSquares);
    }

    setSquares(newSquares);
    checkWinCondition(newSquares);
  }

  function revealAdjacent(index, newSquares) {
    const neighbors = [
      index - 1, index + 1,
      index - width, index + width,
      index - width - 1, index - width + 1,
      index + width - 1, index + width + 1
    ];

    neighbors.forEach(pos => {
      if (pos >= 0 && pos < width * width && 
          !newSquares[pos]?.revealed && 
          !newSquares[pos]?.flagged &&
          Math.abs(pos % width - index % width) <= 1) {
        
        newSquares[pos].revealed = true;
        
        if (newSquares[pos].adjacent === 0) {
          revealAdjacent(pos, newSquares);
        }
      }
    });
  }

  function addFlag(index, e) {
    e.preventDefault();
    if (isGameOver || !gameStarted) return;

    const newSquares = [...squares];
    newSquares[index].flagged = !newSquares[index].flagged;
    setSquares(newSquares);
    checkWinCondition(newSquares);
  }

  function checkWinCondition(board) {
    const allNonBombsRevealed = board.every(square => 
      square.type === "bomb" || square.revealed
    );
    
    if (allNonBombsRevealed) {
      setIsGameOver(true);
      alert("Поздравляем! Вы победили!");
    }
  }

  function gameOver() {
    const newSquares = squares.map(square => ({
      ...square,
      revealed: square.type === "bomb" ? true : square.revealed
    }));
    
    setSquares(newSquares);
    setIsGameOver(true);
    alert("Игра окончена! Вы наступили на мину!");
  }

  function resetGame() {
    setSquares([]);
    setIsGameOver(false);
    setGameStarted(false);
    createBoard();
  }

  function renderSquare(square, index) {
    let content = "";
    
    if (square.revealed) {
      if (square.type === "bomb") {
        content = "💣";
      } else if (square.adjacent > 0) {
        content = square.adjacent;
      }
    } else if (square.flagged) {
      content = "🚩";
    }

    return (
      <div
        key={index}
        style={{
          width: "30px",
          height: "30px",
          backgroundColor: square.revealed 
            ? square.type === "bomb" 
              ? "#FF0000" 
              : "#172A45"
            : "#0A192F",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          color: square.revealed && square.adjacent > 0 ? "#00FFAA" : "#FFFFFF",
          border: `1px solid ${square.revealed ? "#00FFAA" : "#0A192F"}`,
          userSelect: "none",
          transition: "background-color 0.2s ease"
        }}
        onClick={() => click(index)}
        onContextMenu={(e) => addFlag(index, e)}
      >
        {content}
      </div>
    );
  }

  useEffect(() => {
    createBoard();
  }, []);

  return (
    <>
      <Head>
        <title>Сапёр</title>
        <meta name="description" content="Игра Сапёр на React" />
      </Head>
      
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0A192F",
        padding: "20px",
        color: "#FFFFFF"
      }}>
        <h1 style={{ 
          color: "#00FFAA",
          marginBottom: "20px",
          textAlign: "center",
          textShadow: "0 0 5px #00FFAA"
        }}>
          Сапёр
        </h1>
        
        <div style={{ 
          display: "grid",
          gridTemplateColumns: `repeat(${width}, 30px)`,
          gridTemplateRows: `repeat(${width}, 30px)`,
          gap: "2px",
          backgroundColor: "#00FFAA",
          padding: "5px",
          borderRadius: "5px",
          marginBottom: "20px",
          border: "3px solid #00FFAA"
        }}>
          {squares.map((square, index) => renderSquare(square, index))}
        </div>
        
        <div style={{ 
          marginBottom: "20px", 
          textAlign: "center",
          color: "#00FFAA"
        }}>
          <p>Левый клик - открыть клетку</p>
          <p>Правый клик - поставить флажок</p>
        </div>
        
        {isGameOver && (
          <button
            onClick={resetGame}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0A192F",
              color: "#00FFAA",
              border: "2px solid #00FFAA",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              ":hover": {
                backgroundColor: "#00FFAA",
                color: "#0A192F"
              }
            }}
          >
            Новая игра
          </button>
        )}
        
        {!gameStarted && !isGameOver && (
          <div style={{ 
            backgroundColor: "rgba(10, 25, 47, 0.7)",
            padding: "10px",
            borderRadius: "5px",
            marginTop: "10px",
            textAlign: "center",
            border: "1px solid #00FFAA",
            color: "#00FFAA"
          }}>
            <p>Нажмите на любую клетку, чтобы начать игру</p>
            <p>Число показывает количество мин в соседних клетках</p>
          </div>
        )}
      </div>
    </>
  );
}