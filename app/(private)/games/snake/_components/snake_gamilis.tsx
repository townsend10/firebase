"use client";
import { Direction, GameState } from "@/types";
import { Position } from "@/types";
import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150; // ms
const SPEED_INCREASE = 5; // ms reduzidos a cada comida

export const SnakeGamilis = () => {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: Direction.RIGHT,
    gameOver: false,
    score: 0,
    speed: INITIAL_SPEED,
    isPaused: false,
    isStarted: false,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializar o jogo
  const startGame = (): void => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: generateRandomFood([{ x: 10, y: 10 }]),
      direction: Direction.RIGHT,
      gameOver: false,
      score: 0,
      speed: INITIAL_SPEED,
      isPaused: false,
      isStarted: true,
    });
  };

  // Gerar comida em posição aleatória
  const generateRandomFood = (snakeBody: Position[]): Position => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);

    // Verificar se a comida não está na posição da cobra
    for (const segment of snakeBody) {
      if (segment.x === x && segment.y === y) {
        return generateRandomFood(snakeBody);
      }
    }

    return { x, y };
  };

  // Lógica principal do jogo
  const moveSnake = (): void => {
    const {
      snake,
      food,
      direction,
      gameOver,
      isPaused,
      isStarted,
      score,
      speed,
    } = gameState;

    if (gameOver || isPaused || !isStarted) return;

    const head = { ...snake[0] };

    // Mover a cabeça da cobra na direção atual
    switch (direction) {
      case Direction.UP:
        head.y -= 1;
        break;
      case Direction.DOWN:
        head.y += 1;
        break;
      case Direction.LEFT:
        head.x -= 1;
        break;
      case Direction.RIGHT:
        head.x += 1;
        break;
    }

    // Verificar colisão com as paredes
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      setGameState((prev) => ({ ...prev, gameOver: true }));
      return;
    }

    // Verificar colisão com o próprio corpo
    for (const segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        setGameState((prev) => ({ ...prev, gameOver: true }));
        return;
      }
    }

    const newSnake = [head, ...snake];

    // Verificar se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
      const newFood = generateRandomFood(newSnake);
      const newScore = score + 1;
      const newSpeed = Math.max(speed - SPEED_INCREASE, 50);

      setGameState((prev) => ({
        ...prev,
        snake: newSnake,
        food: newFood,
        score: newScore,
        speed: newSpeed,
      }));
    } else {
      // Se não comeu, remove o último segmento (para manter o tamanho)
      newSnake.pop();
      setGameState((prev) => ({
        ...prev,
        snake: newSnake,
      }));
    }
  };

  // Renderizar o jogo no canvas
  const renderGame = (): void => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const { snake, food } = gameState;

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Desenhar a grade (opcional)
    ctx.strokeStyle = "#e5e7eb"; // Tailwind gray-200
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, GRID_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(GRID_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Desenhar a comida
    ctx.fillStyle = "#ef4444"; // Tailwind red-500
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    // Desenhar a cobra
    snake.forEach((segment, index) => {
      // Cabeça em cor diferente
      ctx.fillStyle = index === 0 ? "#166534" : "#22c55e"; // Tailwind green-800 para cabeça, green-500 para corpo
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );

      // Borda para cada segmento
      ctx.strokeStyle = "#14532d"; // Tailwind green-900
      ctx.strokeRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE,
        CELL_SIZE
      );
    });
  };

  // Lidar com entrada do teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      const { direction, gameOver, isPaused, isStarted } = gameState;

      if (!isStarted && e.key === " ") {
        startGame();
        return;
      }

      if (e.key === "p") {
        setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
        return;
      }

      if (gameOver && e.key === "r") {
        startGame();
        return;
      }

      if (isPaused) return;

      switch (e.key) {
        case "ArrowUp":
          if (direction !== Direction.DOWN)
            setGameState((prev) => ({ ...prev, direction: Direction.UP }));
          break;
        case "ArrowDown":
          if (direction !== Direction.UP)
            setGameState((prev) => ({ ...prev, direction: Direction.DOWN }));
          break;
        case "ArrowLeft":
          if (direction !== Direction.RIGHT)
            setGameState((prev) => ({ ...prev, direction: Direction.LEFT }));
          break;
        case "ArrowRight":
          if (direction !== Direction.LEFT)
            setGameState((prev) => ({ ...prev, direction: Direction.RIGHT }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState]);

  // Loop do jogo
  useEffect(() => {
    renderGame();

    const { isPaused, isStarted, gameOver, speed } = gameState;

    if (!isPaused && isStarted && !gameOver) {
      gameLoopRef.current = setTimeout(moveSnake, speed);
    }

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, [gameState]);

  // Controles em tela para dispositivos móveis
  const handleControlClick = (newDirection: Direction): void => {
    const { direction, isPaused, gameOver } = gameState;

    if (isPaused || gameOver) return;

    switch (newDirection) {
      case Direction.UP:
        if (direction !== Direction.DOWN)
          setGameState((prev) => ({ ...prev, direction: Direction.UP }));
        break;
      case Direction.DOWN:
        if (direction !== Direction.UP)
          setGameState((prev) => ({ ...prev, direction: Direction.DOWN }));
        break;
      case Direction.LEFT:
        if (direction !== Direction.RIGHT)
          setGameState((prev) => ({ ...prev, direction: Direction.LEFT }));
        break;
      case Direction.RIGHT:
        if (direction !== Direction.LEFT)
          setGameState((prev) => ({ ...prev, direction: Direction.RIGHT }));
        break;
    }
  };

  const { score, gameOver, isPaused, isStarted } = gameState;

  return (
    <div className=" flex flex-col items-center gap-5">
      <div className=" items-center gap-2">
        <div className="text-2xl font-bold text-gray-800">
          Pontuação: {score}
        </div>
        {!isStarted && (
          <div className="text-center bg-gray-200 p-3 rounded-md mb-2">
            <p>Pressione ESPAÇO para iniciar</p>
            <p>Use as setas para mover a cobra</p>
          </div>
        )}
        {gameOver && (
          <div className="text-center bg-red-100 p-3 rounded-md mb-2 text-red-600 font-bold">
            <p>Fim de Jogo!</p>
            <p>Pressione R para jogar novamente</p>
          </div>
        )}
        {isPaused && !gameOver && (
          <div className="text-center bg-yellow-100 p-3 rounded-md mb-2 text-yellow-600">
            Jogo Pausado
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border-2 border-gray-700 bg-gray-50"
      />

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() =>
              isStarted
                ? setGameState((prev) => ({
                    ...prev,
                    isPaused: !prev.isPaused,
                  }))
                : startGame()
            }
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors"
          >
            {isStarted ? (isPaused ? "Continuar" : "Pausar") : "Iniciar"}
          </button>

          {gameOver && (
            <button
              onClick={startGame}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
            >
              Reiniciar
            </button>
          )}
        </div>

        <div className="flex flex-col items-center mt-2">
          <button
            onClick={() => handleControlClick(Direction.UP)}
            className="w-12 h-12 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-md mb-1 text-xl"
            aria-label="Move Up"
          >
            ↑
          </button>
          <div className="flex gap-1">
            <button
              onClick={() => handleControlClick(Direction.LEFT)}
              className="w-12 h-12 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-md text-xl"
              aria-label="Move Left"
            >
              ←
            </button>
            <button
              onClick={() => handleControlClick(Direction.RIGHT)}
              className="w-12 h-12 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-md text-xl"
              aria-label="Move Right"
            >
              →
            </button>
          </div>
          <button
            onClick={() => handleControlClick(Direction.DOWN)}
            className="w-12 h-12 flex items-center justify-center bg-gray-300 hover:bg-gray-400 rounded-md mt-1 text-xl"
            aria-label="Move Down"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};
