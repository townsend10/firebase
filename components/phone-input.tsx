import React, { forwardRef, useState } from "react";
import { Input } from "./ui/input";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

interface PhoneInputProps {
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

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
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
    const [phoneNumber, setPhoneNumber] = useState("");
    const { pending } = useFormStatus();

    const handlePhoneChange = (event: any) => {
      // Remove caracteres não numéricos do valor digitado
      const rawValue = event.target.value.replace(/\D/g, "");

      // Formata o número de telefone
      const formattedValue = formatPhoneNumber(rawValue);

      // Atualiza o estado do componente com o valor formatado
      setPhoneNumber(formattedValue);
    };

    const formatPhoneNumber = (value: any) => {
      // Adapte a lógica de formatação conforme necessário para atender às suas necessidades
      const match = value.match(/^(\d{0,2})(\d{0,4})(\d{0,4})$/);

      if (match) {
        return `(${match[1]})${match[2] ? " " + match[2] : ""}${
          match[3] ? "-" + match[3] : ""
        }`;
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
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={placeholder}
        type={type}
        disabled={pending || disabled}
        className={cn("text-sm px-2 py-1 h-7", className)}
        aria-describedby={`${id}-error`}
      />
    );
  }
);

PhoneInput.displayName = "PhoneInput";
