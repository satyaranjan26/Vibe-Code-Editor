"use client";

import React from "react";
import { Check, Loader2 } from "lucide-react";

interface LoadingStepProps {
  currentStep: number;
  step: number;
  label: string;
}

export const LoadingStep: React.FC<LoadingStepProps> = ({
  currentStep,
  step,
  label,
}) => {
  const isDone = currentStep > step;
  const isCurrent = currentStep === step;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
        {isDone ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : isCurrent ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
        ) : (
          <span className="text-muted-foreground">{step}</span>
        )}
      </div>
      <span
        className={`text-sm ${
          isDone
            ? "text-muted-foreground line-through"
            : isCurrent
            ? "font-medium text-foreground"
            : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
  );
};

export default LoadingStep;
