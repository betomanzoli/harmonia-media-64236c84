
import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Steps({ children, className, ...props }: StepsProps) {
  // Find all Step children and pass their index to them
  const stepsArray = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === Step
  )

  const steps = stepsArray.map((step, index) => {
    if (React.isValidElement(step)) {
      return React.cloneElement(step, {
        stepNumber: index + 1,
      })
    }
    return step
  })

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {steps}
    </div>
  )
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  stepNumber?: number
  children: React.ReactNode
}

export function Step({ title, stepNumber, children, className, ...props }: StepProps) {
  return (
    <div className={cn("relative pl-8 pb-8", className)} {...props}>
      <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border bg-background text-sm font-medium">
        {stepNumber}
      </div>
      <div className="absolute left-3 top-7 h-full w-px bg-border" />
      <div className="font-medium">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  )
}
