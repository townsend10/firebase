"use client";
import React, { useRef, useEffect, useState } from "react";

const gridSize = 20;
const cellSize = 20;
const gameSpeed = 1000; // Velocidade do jogo em milissegundos

interface SnakeGameProps {
  width: number;
  height: number;
}

export const SnakeGamilis = ({ height, width }: SnakeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameLoop, setGameLoop] = useState<NodeJS.Timeout | null>(null);
  const [gameStarted, setGameStarted] = useState(false); // Adiciona o estado do jogo iniciado

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startGameLoop = () => {
      const newGameLoop = setInterval(() => {
        if (gameOver) {
          clearInterval(newGameLoop);
          setGameLoop(null);
          return;
        }

        update();
        render(ctx);
      }, gameSpeed);

      setGameLoop(newGameLoop);
    };

    if (gameStarted) {
      // Inicia o loop do jogo apenas se o jogo tiver começado
      startGameLoop();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gameOver]); // Adiciona gameStarted como dependência

  const update = () => {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (
      head.x < 0 ||
      head.x >= gridSize ||
      head.y < 0 ||
      head.y >= gridSize ||
      snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      setGameOver(true);
      return;
    }

    const newSnake = [head, ...snake];

    if (head.x === food.x && head.y === food.y) {
      setFood({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });
      setScore(score + 10);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const render = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "blue";
    ctx.fillRect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);

    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
    });

    if (gameOver) {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fillText("Game Over!", width / 2 - 80, height / 2);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-black"
      />
      <p className="mt-4">Score: {score}</p>
      {!gameStarted && ( // Renderiza o botão "Começar Jogo" apenas se o jogo não tiver começado
        <button
          className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setGameStarted(true)}
        >
          Começar Jogo
        </button>
      )}
      {gameOver && (
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setSnake([{ x: 10, y: 10 }]);
            setFood({ x: 5, y: 5 });
            setDirection({ x: 1, y: 0 });
            setGameOver(false);
            setScore(0);
            setGameStarted(true); // Reinicia o jogo
          }}
        >
          Recomeçar
        </button>
      )}
    </div>
  );
};
