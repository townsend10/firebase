import React, { forwardRef, useState } from "react";
import { Input } from "./ui/input";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";

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

// Função para validar CPF
const validateCPF = (cpf: string): boolean => {
  // Remove formatação
  cpf = cpf.replace(/[^\d]/g, "");

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cpf.charAt(10))) return false;

  return true;
};

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
    const [cpfNumber, setCpfNumber] = useState(defaultValue || "");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const { pending } = useFormStatus();

    const formatCpf = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Remove caracteres não numéricos
      const rawValue = event.target.value.replace(/\D/g, "");

      // Limita a 11 dígitos
      const limitedValue = rawValue.slice(0, 11);

      // Formata o CPF
      const formattedValue = formatCpfNumber(limitedValue);

      // Atualiza o estado
      setCpfNumber(formattedValue);

      // Valida apenas se tiver 11 dígitos
      if (limitedValue.length === 11) {
        setIsValid(validateCPF(limitedValue));
      } else {
        setIsValid(null);
      }
    };

    const formatCpfNumber = (value: string) => {
      const match = value.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);

      if (match) {
        return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
      }

      // Formatação parcial enquanto digita
      if (value.length > 9) {
        return value.replace(
          /^(\d{3})(\d{3})(\d{3})(\d{0,2}).*/,
          "$1.$2.$3-$4"
        );
      } else if (value.length > 6) {
        return value.replace(/^(\d{3})(\d{3})(\d{0,3}).*/, "$1.$2.$3");
      } else if (value.length > 3) {
        return value.replace(/^(\d{3})(\d{0,3}).*/, "$1.$2");
      }

      return value;
    };

    const handleBlur = () => {
      if (cpfNumber && cpfNumber.replace(/\D/g, "").length === 11) {
        setIsValid(validateCPF(cpfNumber));
      }
      onBlur?.();
    };

    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            onBlur={handleBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            value={cpfNumber}
            onChange={formatCpf}
            placeholder={placeholder || "000.000.000-00"}
            type="text"
            disabled={pending || disabled}
            className={cn(
              "text-sm px-2 py-1 h-7",
              isValid === false &&
                "border-destructive focus-visible:ring-destructive",
              isValid === true &&
                "border-green-500 focus-visible:ring-green-500",
              className
            )}
            aria-describedby={`${id}-error`}
            maxLength={14} // 11 dígitos + 3 caracteres de formatação
          />
          {isValid === false && (
            <p className="text-xs text-destructive mt-1">CPF inválido</p>
          )}
          {isValid === true && (
            <p className="text-xs text-green-600 mt-1">CPF válido</p>
          )}
        </div>
        {errors && errors[id] && (
          <div
            id={`${id}-error`}
            aria-live="polite"
            className="text-xs text-destructive mt-1"
          >
            {errors[id]?.map((error: string) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        )}
      </div>
    );
  }
);

CpfInput.displayName = "CpfInput";
