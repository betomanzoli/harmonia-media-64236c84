
import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface StepsContextValue {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

const StepsContext = createContext<StepsContextValue | undefined>(undefined);

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error("useSteps must be used within a StepsProvider");
  }
  return context;
};

interface StepsProviderProps {
  children: React.ReactNode;
  initialStep?: number;
  onValueChange?: (step: number) => void;
}

export const StepsProvider: React.FC<StepsProviderProps> = ({ 
  children, 
  initialStep = 0,
  onValueChange
}) => {
  const [step, setInternalStep] = useState(initialStep);
  
  const setStep = (value: React.SetStateAction<number>) => {
    const newStep = typeof value === 'function' ? value(step) : value;
    setInternalStep(newStep);
    onValueChange?.(newStep);
  };

  return (
    <StepsContext.Provider value={{ step, setStep }}>
      {children}
    </StepsContext.Provider>
  );
};

interface StepProps {
  title: string;
  description?: string;
  value: number;
  className?: string;
}

export const Step: React.FC<StepProps> = ({ title, description, value, className }) => {
  const { step } = useSteps();
  const isActive = step === value;
  const isCompleted = step > value;

  return (
    <div 
      className={cn(
        "flex flex-col items-center",
        className
      )}
    >
      <div 
        className={cn(
          "rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium border transition-colors",
          isActive ? "bg-harmonia-green text-white border-harmonia-green" : 
          isCompleted ? "bg-harmonia-green/20 text-harmonia-green border-harmonia-green" : 
          "bg-muted text-muted-foreground border-muted-foreground/30"
        )}
      >
        {value + 1}
      </div>
      <div className="text-center mt-2">
        <p 
          className={cn(
            "text-sm font-medium",
            isActive || isCompleted ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {title}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
};

interface StepsNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export const StepsNavigation: React.FC<StepsNavigationProps> = ({ children, className }) => {
  return (
    <div className={cn("flex relative", className)}>
      <div className="w-full flex justify-between z-10">
        {children}
      </div>
      
      <div 
        className="absolute top-4 left-0 right-0 h-0.5 bg-muted"
        style={{ width: "calc(100% - 2rem)", marginLeft: "1rem", marginRight: "1rem" }}
      />
    </div>
  );
};

interface StepsContentProps {
  children: React.ReactNode;
  value: number;
  className?: string;
}

export const StepsContent: React.FC<StepsContentProps> = ({ children, value, className }) => {
  const { step } = useSteps();
  
  if (step !== value) return null;
  
  return <div className={cn("mt-4", className)}>{children}</div>;
};
