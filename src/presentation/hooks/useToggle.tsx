/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useState } from "react";

export function useToggle(init?: boolean) {
  const [currentToggle, setToggle] = useState<boolean>(init || false);

  const handleToggle = useCallback(() => {
    setToggle(prevVal => !prevVal);
  }, []);
  

  return [currentToggle, handleToggle, setToggle] as const;
}