import { Button } from "@nextui-org/react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();
  return (
    <Button
      onClick={() => navigate(-1)}
      startContent={<IoArrowBackOutline />}
      size="sm"
    />
  );
}
