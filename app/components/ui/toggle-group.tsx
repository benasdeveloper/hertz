import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { Circle, CircleCheckBig, Square, SquareCheckBig } from "lucide-react";
import { cn } from "@/lib/classnames";
import { toggleVariants } from "@/components/ui/toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & { type: "single" | "multiple" }
>({
  size: "default",
  variant: "default",
  type: "single",
});

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(
  (
    { className, variant, size, children, type = "multiple", ...props },
    ref,
  ) => (
    <ToggleGroupPrimitive.Root
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type={type as any}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, type }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  ),
);

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const iconContainerClassName =
  "mr-1.5 -ml-0.5 text-foreground/70 group-data-[state=on]:text-accent-foreground";

const iconClassName = cva("size-[14px] stroke-2", {
  variants: {
    state: {
      checked: "hidden group-data-[state=on]:block",
      unchecked: "block group-data-[state=on]:hidden",
    },
  },
});

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext);

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "group flex flex-row items-center whitespace-nowrap",
        className,
      )}
      {...props}
    >
      {context.type === "single" && (
        <span className={iconContainerClassName}>
          <CircleCheckBig className={iconClassName({ state: "checked" })} />
          <Circle className={iconClassName({ state: "unchecked" })} />
        </span>
      )}
      {context.type === "multiple" && (
        <span className={iconContainerClassName}>
          <SquareCheckBig className={iconClassName({ state: "checked" })} />
          <Square className={iconClassName({ state: "unchecked" })} />
        </span>
      )}
      <span>{children}</span>
    </ToggleGroupPrimitive.Item>
  );
});

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup, ToggleGroupItem };
