import { useGridApiRef } from "@mui/x-data-grid";
import { useEffect, useRef } from "react";

interface IProps {
  isLoading: boolean;
  onNextPage: () => void;
  threshold?: number;
}

export const useTableScrollInfinitie = ({ onNextPage, isLoading, threshold = 0 }: IProps) => {
  const gridApiRef = useGridApiRef();
  const scrollMonitor = useRef<Function | null>(null);

  useEffect(() => {
    if (gridApiRef.current?.instanceId) {
      // Obtenemos el elementScroll
      const elementScroll =
        gridApiRef.current.rootElementRef.current?.children[0].children[1];

      // Suscripción al evento scrollPositionChange si no está cargando datos
      if (!isLoading && elementScroll) {
        scrollMonitor.current = gridApiRef.current.subscribeEvent(
          "scrollPositionChange",
          (event) => {
            const maxScrollTop =
              elementScroll.scrollHeight - elementScroll.clientHeight;
            const scrollThreshold = maxScrollTop * (1 - threshold / 100);

            if (event.top >= scrollThreshold) {
              onNextPage();
            }
          }
        );
      }
    }

    // Cleanup al desmontar el componente o cambiar dependencias
    return () => {
      if (scrollMonitor.current) {
        scrollMonitor.current();
      }
    };
  }, [gridApiRef, isLoading]);

  return { gridApiRef };
};
