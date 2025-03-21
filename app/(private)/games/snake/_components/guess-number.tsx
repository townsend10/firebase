"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
export const GuessNumber = () => {
  const [secretNumber, setSecretNumber] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleGuess = () => {
    const guessNumber = parseInt(guess);
    setAttempts(attempts + 1);

    if (guessNumber === secretNumber) {
      setMessage(
        `Parabéns! Você adivinhou o número em ${attempts + 1} tentativas.`
      );
      setSecretNumber(Math.floor(Math.random() * 100) + 1);
      setAttempts(0);
    } else if (guessNumber < secretNumber) {
      setMessage("Tente um número maior.");
    } else {
      setMessage("Tente um número menor.");
    }

    setGuess("");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1 className="text-3xl font-bold">Jogo de Adivinhação</h1>
      <p className="mt-2 text-muted-foreground">
        Tente adivinhar o número entre 1 e 100.
      </p>
      <Input
        className="mt-5"
        type="number"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
      />
      <Button onClick={handleGuess} className="mt-5 w-full">
        Adivinhar
      </Button>
      <p className="text-2xl font-bold mt-2">{message}</p>
    </div>
  );
};
