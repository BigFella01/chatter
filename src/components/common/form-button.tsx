"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@nextui-org/react";

interface FormButtonProps {
  children: React.ReactNode;
}

export default function FormButton({ children }: FormButtonProps) {
  const { pending } = useFormStatus();
  // The component using useFormStatus() must be rendered within a form. 

  return (
    <Button type="submit" isLoading={pending}>
      {children}
    </Button>
  );
}
