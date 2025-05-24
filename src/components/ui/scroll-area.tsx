
import React, { forwardRef } from 'react';
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportRef?: React.RefObject<HTMLDivElement>;
  orientation?: "vertical" | "horizontal";
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, viewportRef, orientation = "vertical", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        {...props}
      >
        <div
          ref={viewportRef}
          className={cn(
            "h-full w-full overflow-auto",
            orientation === "horizontal" ? "overflow-x-auto overflow-y-hidden" : "overflow-x-hidden"
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

const ScrollBar = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    orientation?: "vertical" | "horizontal";
    thumbSize?: number;
  }
>(({ className, orientation = "vertical", thumbSize = 0, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex touch-none select-none",
        orientation === "vertical"
          ? "h-full w-2.5 border-l border-l-transparent p-px"
          : "h-2.5 border-t border-t-transparent p-px",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "relative flex-1 rounded-full bg-gray-200",
          orientation === "vertical" ? "w-1.5" : "h-1.5"
        )}
        style={{
          [orientation === "vertical" ? "height" : "width"]:
            thumbSize > 0 ? `${thumbSize}%` : "auto",
        }}
      />
    </div>
  );
});

ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
