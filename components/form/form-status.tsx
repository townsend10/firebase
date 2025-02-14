import React from "react";

interface SelectStatusProps {
  value: string;
  onChange: (value: string) => void;
  errors?: string[];
}

const SelectStatus: React.FC<SelectStatusProps> = ({ value, onChange, errors }) => {
  const options = [
    { value: "confirm", label: "Confirmado" },
    { value: "cancel", label: "Cancelado" },
    { value: "waiting", label: "Aguardando" },
  ];

  return (
    <div className="mb-10">
      <select
        id="status"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded p-2"
      >
        <option value="">Selecione o status</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors && errors.length > 0 && (
        <div className="text-red-600">{errors.join(", ")}</div>
      )}
    </div>
  );
};

export default SelectStatus;
