import React, { forwardRef, useState } from "react";
import { Input } from "./ui/input";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface CpfInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  (
    {
      id,
      defaultValue,
      disabled,
      label,
      onBlur,
      required,
      type,
      className,
      errors,
      placeholder,
    },
    ref
  ) => {
    const [cpfNumber, setCpfNumber] = useState("");
    const { pending } = useFormStatus();

    const formatCpf = (event: any) => {
      // Remove caracteres não numéricos do valor digitado
      const rawValue = event.target.value.replace(/\D/g, "");

      // Formata o número de telefone
      const formattedValue = formatPhoneNumber(rawValue);

      // Atualiza o estado do componente com o valor formatado
      setCpfNumber(formattedValue);
    };

    const formatPhoneNumber = (value: any) => {
      const match = value.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
      }

      return value;
    };

    return (
      <Input
        onBlur={onBlur}
        defaultValue={defaultValue}
        ref={ref}
        required={required}
        name={id}
        id={id}
        value={cpfNumber}
        onChange={formatCpf}
        placeholder={placeholder}
        type={type}
        disabled={pending || disabled}
        className={cn("text-sm px-2 py-1 h-7", className)}
        aria-describedby={`${id}-error`}
      />
    );
  }
);

CpfInput.displayName = "PhoneInput";
