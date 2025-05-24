
import * as React from "react";
import * as SlotPrimitive from "@radix-ui/react-slot";

type SlotProps = React.ComponentPropsWithoutRef<typeof SlotPrimitive.Slot>;

const Slot = React.forwardRef<
  React.ElementRef<typeof SlotPrimitive.Slot>,
  SlotProps
>(({ children, ...props }, ref) => (
  <SlotPrimitive.Slot ref={ref} {...props}>
    {children}
  </SlotPrimitive.Slot>
));

Slot.displayName = SlotPrimitive.Slot.displayName;

export { Slot };
