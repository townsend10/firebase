"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export const SnakeGame = () => {
  const [note1, setNota1] = useState("");
  const [note2, setNota2] = useState("");

  const [average, setAverage] = useState<number | null>(null);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || (parseFloat(value) >= 0 && parseFloat(value) <= 10)) {
        setter(value);
      }
    };

  const calculateAverage = () => {
    const num1 = parseFloat(note1);
    const num2 = parseFloat(note2);
    if (!isNaN(num1) && !isNaN(num2)) {
      setAverage((num1 + num2) / 2);
    } else {
      setAverage(null);
    }
  };
  return (
    <div className="flex flex-col  ml-5">
      <h1 className="mt-5 text-5xl font-bold">Média dos alunos</h1>
      <div className="mt-5 "></div>
      <Input
        type="number"
        onChange={handleInputChange(setNota1)}
        value={note1}
        placeholder="Digite sua primeira nota"
        max={10}
        className="mb-2"
      />
      <Input
        type="number"
        onChange={handleInputChange(setNota2)}
        value={note2}
        className="mb-2"
        max={10}
        placeholder="Digite sua segunada nota"
      />
      <input max={10} type="number" />
      <Button onClick={calculateAverage}>Calcular Média</Button>

      {average !== null && (
        <div className="flex  flex-col space-y-2 mt-2 text-5xl items-center justify-center">
          <p className="text-muted-foreground">Media : {average.toFixed(2)}</p>
          <div className=" ">
            {average >= 6 ? (
              <p className="text-green-500">Aprovado</p>
            ) : (
              <p className="text-rose-500">Reprovado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
