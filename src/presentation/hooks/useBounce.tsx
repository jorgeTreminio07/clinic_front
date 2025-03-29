import { useEffect, useRef, useState } from "react";

export function useBounce<T>(delay = 500) {
  const [value, setValue] = useState<T | undefined>();
  const [valueBounce, setValueBounce] = useState<T | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null); // Usamos `number` en lugar de `NodeJS.Timeout`

  useEffect(() => {
    // Si el valor es válido y se tiene un valor anterior, activa el loading
    if (value !== undefined && value !== "") {
      setIsLoading(true);

      // Limpia el timeout anterior si existe
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Configura un nuevo timeout
      timeoutRef.current = window.setTimeout(() => {
        setValueBounce(value); // Actualiza el valor que se debe "rebotar"
        setIsLoading(false); // Desactiva el loading después del timeout
      }, delay);
    } else {
      setValueBounce(value); // Si el valor es vacío o indefinido, actualiza sin delay
      setIsLoading(false); // Asegúrate de desactivar el loading si el valor es vacío
    }

    // Cleanup al desmontar el componente o cambiar el valor
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return { setValue, isLoading, valueBounce };
}
