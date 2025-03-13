import { createContext, useContext, forwardRef } from "react";
import { cn } from "@/lib/utils";

const SidebarContext = createContext({});

export function SidebarProvider({ children }) {
  return <SidebarContext.Provider value={{}}>{children}</SidebarContext.Provider>;
}

export const Sidebar = forwardRef(({ className, children, ...props }, ref) => {
  return (
    <aside
      ref={ref}
      className={cn("w-[300px] border-r bg-background", className)}
      {...props}
    >
      {children}
    </aside>
  );
});
Sidebar.displayName = "Sidebar";

export const SidebarHeader = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});
SidebarHeader.displayName = "SidebarHeader";

export const SidebarContent = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("overflow-auto flex-1", className)}
      {...props}
    />
  );
});
SidebarContent.displayName = "SidebarContent";

export const SidebarFooter = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});
SidebarFooter.displayName = "SidebarFooter";

export const SidebarMenu = forwardRef(({ className, ...props }, ref) => {
  return (
    <nav ref={ref} className={cn("space-y-1", className)} {...props} />
  );
});
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("", className)} {...props} />;
});
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "w-full flex items-center py-2 px-3 rounded-md text-sm",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarTrigger = forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "p-2 rounded-md hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarSeparator = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("h-[1px] bg-border my-2", className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = "SidebarSeparator";