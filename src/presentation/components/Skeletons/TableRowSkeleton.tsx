import { TableRow, TableCell, Skeleton } from "@nextui-org/react";

interface IProps {
  columns: number; // Número de columnas a mostrar en el esqueleto
}

const TableRowSkeleton = ({ columns }: IProps) => {
  return (
    <TableRow>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="w-full h-6 rounded-md" />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TableRowSkeleton