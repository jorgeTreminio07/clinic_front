import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

interface IProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export function InputCounter({ initialValue = 0, min = 0, max = Infinity, onChange }: IProps) {
  const [value, setValue] = useState<string>(initialValue.toString());

  // Sincroniza el valor inicial cuando cambia
  useEffect(() => {
    setValue(initialValue.toString());
  }, [initialValue]);

  // Llama al callback `onChange` solo si el valor es válido
  useEffect(() => {
    const numericValue = parseInt(value);
    if (!isNaN(numericValue)) {
      onChange?.(numericValue);
    }
  }, [value]);

  // Valida el valor y actualiza el estado con límites
  const updateValue = (newValue: number) => {
    const clampedValue = Math.min(Math.max(newValue, min), max); // Ajustar dentro del rango
    setValue(clampedValue.toString());
    onChange?.(clampedValue); // Notificar al padre
  };

  // Maneja el cambio en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^\d*$/.test(inputValue)) {
      setValue(inputValue); // Permitir cadenas vacías o numéricas
    }
  };

  // Valida al perder el foco
  const handleBlur = () => {
    const numericValue = parseInt(value);
    if (isNaN(numericValue)) {
      setValue(min.toString()); // Restablece al mínimo si no es válido
    } else {
      updateValue(numericValue); // Ajustar dentro de los límites si es necesario
    }
  };

  return (
    <div className="flex items-center max-w-[8rem] h-full flex-row gap-1">
      {/* Botón de Decremento */}
      <Button
        onClick={() => updateValue(parseInt(value || "0") - 1)}
        isIconOnly
        size="sm"
        variant="flat"
        startContent={<FiMinus />}
        isDisabled={parseInt(value || "0") <= min} // Deshabilitar si está en el límite inferior
      />

      {/* Campo de entrada */}
      <Input
        data-input-counter
        placeholder="0"
        className="text-center w-fit"
        size="sm"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
      />

      {/* Botón de Incremento */}
      <Button
        onClick={() => updateValue(parseInt(value || "0") + 1)}
        isIconOnly
        size="sm"
        variant="flat"
        startContent={<FiPlus />}
        isDisabled={parseInt(value || "0") >= max} // Deshabilitar si está en el límite superior
      />
    </div>
  );
}
