"use client";

import { useEffect, useRef, useState } from "react";

const TILE_SIZE = 28;
const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;
const COLOR = "#00FFAA"; // Зелёный цвет
const BLOCK_SIZE = 2.8;
const GRID_SIZE = Math.floor(TILE_SIZE / BLOCK_SIZE); // 28 / 2.8 = 10

export default function SurvivalGame() {
  const canvasRef = useRef(null);
  const [player, setPlayer] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState("right");
  const [currentLocation, setCurrentLocation] = useState("forest");

  const generateForestMap = () => {
    // Карта леса: 0=земля, 1=ёлка
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    // Добавляем 100 ёлок
    let treesPlaced = 0;
    while (treesPlaced < 100) {
      const x = Math.floor(Math.random() * MAP_WIDTH);
      const y = Math.floor(Math.random() * MAP_HEIGHT);
      if (map[y][x] === 0) {
        map[y][x] = 1; // Ёлка
        treesPlaced++;
      }
    }

    return map;
  };

  const generateVillageMap = () => {
    // Карта деревни: 0=земля, 1=ёлка, 2,3,4=части хижины
    const map = Array(MAP_HEIGHT)
      .fill(null)
      .map(() => Array(MAP_WIDTH).fill(0));

    // Размещаем хижину 3x3 в центре (примерно x=19, y=14)
    const cabinX = 19; // Начало хижины по x
    const cabinY = 14; // Начало хижины по y
    // Хижина 3x3: 2=верх (крыша), 3=середина (стены), 4=низ (основание)
    map[cabinY][cabinX] = 2;     // Верхний левый
    map[cabinY][cabinX + 1] = 2; // Верхний центр
    map[cabinY][cabinX + 2] = 2; // Верхний правый
    map[cabinY + 1][cabinX] = 3; // Средний левый
    map[cabinY + 1][cabinX + 1] = 3; // Средний центр
    map[cabinY + 1][cabinX + 2] = 3; // Средний правый
    map[cabinY + 2][cabinX] = 4; // Нижний левый
    map[cabinY + 2][cabinX + 1] = 4; // Нижний центр
    map[cabinY + 2][cabinX + 2] = 4; // Нижний правый

    // Добавляем ёлки вокруг хижины (в радиусе 1-2 тайлов)
    const treePositions = [
      [cabinY - 2, cabinX - 1], [cabinY - 2, cabinX], [cabinY - 2, cabinX + 1], [cabinY - 2, cabinX + 2], [cabinY - 2, cabinX + 3], // Верхний ряд
      [cabinY - 1, cabinX - 2], [cabinY - 1, cabinX + 4], // Верхние углы
      [cabinY + 3, cabinX - 2], [cabinY + 3, cabinX + 4], // Нижние углы
      [cabinY + 3, cabinX - 1], [cabinY + 3, cabinX], [cabinY + 3, cabinX + 1], [cabinY + 3, cabinX + 2], [cabinY + 3, cabinX + 3], // Нижний ряд
      [cabinY, cabinX - 2], [cabinY + 1, cabinX - 2], [cabinY + 2, cabinX - 2], // Левый ряд
      [cabinY, cabinX + 4], [cabinY + 1, cabinX + 4], [cabinY + 2, cabinX + 4], // Правый ряд
    ];

    treePositions.forEach(([y, x]) => {
      if (
        x >= 0 &&
        x < MAP_WIDTH &&
        y >= 0 &&
        y < MAP_HEIGHT &&
        map[y][x] === 0
      ) {
        map[y][x] = 1; // Ёлка
      }
    });

    return map;
  };

  const [forestMap] = useState(generateForestMap);
  const [villageMap] = useState(generateVillageMap);
  const [gameMap, setGameMap] = useState(forestMap);

  const drawBlock = (ctx, baseX, baseY, gridX, gridY, color) => {
    const blockX = baseX + gridX * BLOCK_SIZE;
    const blockY = baseY + gridY * BLOCK_SIZE;
    ctx.fillStyle = color;
    ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
  };

  const renderTile = (ctx, x, y, tile) => {
    const baseX = x * TILE_SIZE;
    const baseY = y * TILE_SIZE;

    // Земля (0)
    if (tile === 0) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);
    }

    // Ёлка (1) — паттерн 8x13 (7 слоёв + ствол)
    if (tile === 1) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const treePattern = [
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // Слой 0 (ширина 1)
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // Слой 1 (ширина 3)
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // Слой 2 (ширина 3)
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0], // Слой 3 (ширина 5)
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0], // Слой 4 (ширина 7)
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // Слой 5 (ширина 9)
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0], // Слой 6 (ширина 11)
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0], // Слой 7 (ширина 11)
        [0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // Ствол (ширина 2)
      ];

      const offsetX = Math.floor((GRID_SIZE - 13) / 2); // (10 - 13) / 2 = 0
      const offsetY = Math.floor((GRID_SIZE - 8) / 2); // (10 - 8) / 2 = 1

      for (let py = 0; py < treePattern.length; py++) {
        for (let px = 0; px < treePattern[py].length; px++) {
          if (treePattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Хижина: верх (2) — крыша
    if (tile === 2) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const roofPattern = [
        [0, 0, 0, 0, 0], // Пусто
        [0, 0, 1, 0, 0], // Треугольник крыши
        [0, 1, 1, 1, 0], // Треугольник крыши
        [1, 1, 1, 1, 1], // Основание крыши
        [1, 1, 1, 1, 1], // Продолжение основания
      ];

      const offsetX = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2
      const offsetY = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2

      for (let py = 0; py < roofPattern.length; py++) {
        for (let px = 0; px < roofPattern[py].length; px++) {
          if (roofPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Хижина: середина (3) — стены
    if (tile === 3) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const wallPattern = [
        [1, 1, 1, 1, 1], // Верх стены
        [1, 1, 1, 1, 1], // Стена
        [1, 0, 1, 0, 1], // Окна (или пустоты)
        [1, 1, 0, 1, 1], // Дверь в центре (для среднего тайла)
        [1, 1, 1, 1, 1], // Низ стены
      ];

      const offsetX = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2
      const offsetY = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2

      for (let py = 0; py < wallPattern.length; py++) {
        for (let px = 0; px < wallPattern[py].length; px++) {
          if (wallPattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }

    // Хижина: низ (4) — основание
    if (tile === 4) {
      ctx.fillStyle = "black";
      ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

      const basePattern = [
        [1, 1, 1, 1, 1], // Верх основания
        [1, 1, 1, 1, 1], // Основание
        [1, 1, 1, 1, 1], // Основание
        [1, 1, 1, 1, 1], // Основание
        [1, 1, 1, 1, 1], // Низ
      ];

      const offsetX = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2
      const offsetY = Math.floor((GRID_SIZE - 5) / 2); // (10 - 5) / 2 = 2

      for (let py = 0; py < basePattern.length; py++) {
        for (let px = 0; px < basePattern[py].length; px++) {
          if (basePattern[py][px] === 1) {
            drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
          }
        }
      }
    }
  };

  const renderPlayer = (ctx) => {
    const baseX = player.x * TILE_SIZE;
    const baseY = player.y * TILE_SIZE;

    // Фон
    ctx.fillStyle = "black";
    ctx.fillRect(baseX, baseY, TILE_SIZE, TILE_SIZE);

    // Базовый паттерн игрока 8x12 (смотрит вправо)
    const playerPatternRight = [
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], // Строка 1
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0], // Строка 2
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Строка 3
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0], // Строка 4
      [0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0], // Строка 5
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0], // Строка 6
      [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0], // Нога левая
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0], // Нога правая
    ];

    // Зеркальный паттерн для взгляда влево
    const playerPatternLeft = playerPatternRight.map(row => [...row].reverse());

    // Выбираем паттерн в зависимости от направления
    const playerPattern = direction === "right" ? playerPatternRight : playerPatternLeft;

    // Центрируем шаблон 8x12 в сетке 10x10
    const offsetX = Math.floor((GRID_SIZE - 12) / 2); // (10 - 12) / 2 = 0
    const offsetY = Math.floor((GRID_SIZE - 8) / 2); // (10 - 8) / 2 = 1

    for (let py = 0; py < playerPattern.length; py++) {
      for (let px = 0; px < playerPattern[py].length; px++) {
        if (playerPattern[py][px] === 1) {
          drawBlock(ctx, baseX, baseY, px + offsetX, py + offsetY, COLOR);
        }
      }
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Очищаем канвас
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рендерим карту
    for (let y = 0; y < MAP_HEIGHT; y++) {
      for (let x = 0; x < MAP_WIDTH; x++) {
        renderTile(ctx, x, y, gameMap[y][x]);
      }
    }

    // Рендерим игрока
    renderPlayer(ctx);
  };

  const move = (dx, dy) => {
    const newX = player.x + dx;
    const newY = player.y + dy;

    // Проверяем выход за правую границу леса
    if (currentLocation === "forest" && newX >= MAP_WIDTH) {
      setCurrentLocation("village");
      setGameMap(villageMap);
      setPlayer({ x: 0, y: player.y }); // Перемещаем игрока на левую сторону новой карты
      setDirection("right");
      return;
    }

    // Проверяем выход за левую границу деревни (возврат в лес)
    if (currentLocation === "village" && newX < 0) {
      setCurrentLocation("forest");
      setGameMap(forestMap);
      setPlayer({ x: MAP_WIDTH - 1, y: player.y }); // Перемещаем игрока на правую сторону леса
      setDirection("left");
      return;
    }

    // Обычное движение
    if (
      newX >= 0 &&
      newX < MAP_WIDTH &&
      newY >= 0 &&
      newY < MAP_HEIGHT &&
      gameMap[newY][newX] !== 1 && // Нельзя проходить через ёлки
      gameMap[newY][newX] !== 2 && // Нельзя проходить через части хижины
      gameMap[newY][newX] !== 3 &&
      gameMap[newY][newX] !== 4
    ) {
      setPlayer({ x: newX, y: newY });
      if (dx < 0) {
        setDirection("left");
      } else if (dx > 0) {
        setDirection("right");
      }
    }
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") move(0, -1);
      if (e.key === "ArrowDown") move(0, 1);
      if (e.key === "ArrowLeft") move(-1, 0);
      if (e.key === "ArrowRight") move(1, 0);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player, direction, currentLocation, gameMap]);

  useEffect(() => {
    render();
  }, [player, direction, gameMap]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "black",
        height: "100vh",
      }}
    >
      <h1 style={{ color: COLOR, fontFamily: "monospace", fontSize: "20px" }}>
        Survival Game (Pixel Style) - {currentLocation === "forest" ? "Forest" : "Village"}
      </h1>
      <canvas
        ref={canvasRef}
        width={MAP_WIDTH * TILE_SIZE}
        height={MAP_HEIGHT * TILE_SIZE}
        style={{
          border: `2px solid ${COLOR}`,
          imageRendering: "pixelated",
        }}
      />
      <p style={{ color: "#888", fontFamily: "monospace" }}>
        Используйте стрелки для движения
      </p>
    </div>
  );
}