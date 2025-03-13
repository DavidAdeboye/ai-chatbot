import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Avatar = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Avatar.displayName = "Avatar";

export { Avatar };