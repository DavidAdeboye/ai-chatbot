import { createContext, forwardRef, useContext, useState } from "react";
import { cn } from "@/lib/utils";

const DropdownMenuContext = createContext({});

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      {children}
    </DropdownMenuContext.Provider>
  );
};

const DropdownMenuTrigger = forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  const Comp = asChild ? "span" : "button";
  
  return (
    <Comp
      ref={ref}
      onClick={() => setOpen(prev => !prev)}
      {...props}
    >
      {children}
    </Comp>
  );
});
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = forwardRef(({ children, className, align = "center", ...props }, ref) => {
  const { open, setOpen } = useContext(DropdownMenuContext);
  
  if (!open) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        "animate-in fade-in-0 zoom-in-95",
        {
          "origin-top-right right-0": align === "end",
          "origin-top-left left-0": align === "start",
          "origin-top": align === "center",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = forwardRef(({ className, children, ...props }, ref) => {
  const { setOpen } = useContext(DropdownMenuContext);
  
  return (
    <button
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
        "focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    >
      {children}
    </button>
  );
});
DropdownMenuItem.displayName = "DropdownMenuItem";

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem };