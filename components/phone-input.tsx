import React, { forwardRef, useState } from "react";
import { Input } from "./ui/input";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { FormErrors } from "./form/form-errors";

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
  max?: number;
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
      max,
    },
    ref
  ) => {
    const [phoneNumber, setPhoneNumber] = useState(defaultValue || "");
    const { pending } = useFormStatus();

    const formatPhone = (event: React.ChangeEvent<HTMLInputElement>) => {
      // Remove caracteres não numéricos
      const rawValue = event.target.value.replace(/\D/g, "");

      // Limita a 11 dígitos (DDD + número)
      const limitedValue = rawValue.slice(0, 11);

      // Formata o número
      const formattedValue = formatPhoneNumber(limitedValue);

      // Atualiza o estado
      setPhoneNumber(formattedValue);
    };

    const formatPhoneNumber = (value: string) => {
      // Celular: (00) 00000-0000
      const cellMatch = value.match(/^(\d{2})(\d{5})(\d{4})$/);
      if (cellMatch) {
        return `(${cellMatch[1]}) ${cellMatch[2]}-${cellMatch[3]}`;
      }

      // Fixo: (00) 0000-0000
      const fixedMatch = value.match(/^(\d{2})(\d{4})(\d{4})$/);
      if (fixedMatch) {
        return `(${fixedMatch[1]}) ${fixedMatch[2]}-${fixedMatch[3]}`;
      }

      // Formatação parcial enquanto digita
      if (value.length > 10) {
        return value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
      } else if (value.length > 6) {
        return value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (value.length > 2) {
        return value.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
      }

      return value;
    };

    return (
      <div className="space-y-2">
        <div className="space-y-1">
          {label ? (
            <Label htmlFor={id} className="text-sm font-medium">
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
          ) : null}
          <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            value={phoneNumber}
            onChange={formatPhone}
            placeholder={placeholder || "(00) 00000-0000"}
            type="tel"
            disabled={pending || disabled}
            className={cn("text-sm px-2 py-1 h-7", className)}
            aria-describedby={`${id}-error`}
            maxLength={15} // (00) 00000-0000
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";
