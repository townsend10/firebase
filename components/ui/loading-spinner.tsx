import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({
  className,
  text = "Carregando...",
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-[50vh] w-full",
        className
      )}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
};
