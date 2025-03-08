import { SquarePen } from "lucide-react";
import LogoWW from "./components/Logo";
import ReservedDate from "./components/ReservedDate";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TimeRangeFilters } from "./components/TimeRangeFilters";
import { useFormContext } from "react-hook-form";
import { FormValues } from "@/context/FormFilterContext/types";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

const FixedHeader = () => {
  const location = useLocation();

  const isIndexPage = (() => {
    return location.pathname !== "/";
  })();

  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");

  return (
    <div className="h-20 lg:h-[116px]">
      <Sheet>
        <header className="fixed w-screen bg-white/80 shadow-lg backdrop-blur-md">
          <div className="mx-auto grid grid-cols-5 px-4 lg:w-4/5 lg:px-0">
            <LogoWW />
            {!isIndexPage ? (
              <div className="col-span-4 py-6 lg:mx-auto">
                <SheetTrigger asChild>
                  <div className="group relative flex items-center justify-center gap-4 rounded-3xl py-1 pl-10 pr-14 hover:cursor-pointer hover:bg-white hover:shadow-md lg:gap-12">
                    <ReservedDate
                      compData={{
                        title: "Pick-up",
                        date: format(startDate, "PP"),
                        hour: startTime,
                      }}
                    />
                    <span className="hidden h-10 w-[1.5px] bg-neutral-200 lg:block" />
                    <ReservedDate
                      compData={{
                        title: "Drop-off",
                        date: format(endDate, "PP"),
                        hour: endTime,
                      }}
                    />
                    <SquarePen className="invisible absolute right-4 w-4 text-neutral-500 group-hover:visible" />
                  </div>
                </SheetTrigger>
              </div>
            ) : (
              <div className="h-[100px]" />
            )}
          </div>
        </header>
        <SheetContent
          side={"top"}
          className="border-b-4 border-solid border-amber-300 pt-14"
        >
          <SheetTitle />
          <TimeRangeFilters />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export { FixedHeader };
