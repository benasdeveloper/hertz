import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface LeftDrawerFiltersProps {
  children: ReactNode;
  content: ReactNode | ReactNode[];
}

const LeftDrawerFilters = ({ children, content }: LeftDrawerFiltersProps) => {
  return (
    <Sheet>
      <SheetContent
        side={"left"}
        className="border-r-4 border-solid border-amber-300 pt-12"
      >
        <SheetTitle className="text-2xl font-semibold">
          Filter options
        </SheetTitle>
        {content}
        <SheetClose asChild>
          <Button variant="outline" className="mt-4 w-full">
            Close
          </Button>
        </SheetClose>
      </SheetContent>
      <SheetTrigger asChild>{children}</SheetTrigger>
    </Sheet>
  );
};

export { LeftDrawerFilters };
