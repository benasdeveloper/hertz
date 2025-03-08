import { trpc } from "@/trpc.ts";
import { useFormContext } from "react-hook-form";
import { combineDateTime } from "@/context/FormFilterContext/helper/combineDateTime";
import { FormValues } from "@/context/FormFilterContext/types";
import { Button } from "@/components/ui/button.tsx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { formatCents } from "@/lib/formatters";
import { DoorOpen, UserRound } from "lucide-react";
import { PaginationButtons } from "@/components/Base/PaginationButtons";

const VehicleList = () => {
  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const startTime = form.watch("startTime");
  const endDate = form.watch("endDate");
  const endTime = form.watch("endTime");
  const minPassengers = form.watch("minPassengers");
  const classification = form.watch("classification");
  const make = form.watch("make");
  const price = form.watch("price");
  const page = form.watch("page");

  const startDateTime = useMemo(
    () => combineDateTime(startDate, startTime),
    [startDate, startTime],
  );
  const endDateTime = useMemo(
    () => combineDateTime(endDate, endTime),
    [endDate, endTime],
  );

  const [searchResponse] = trpc.vehicles.search.useSuspenseQuery(
    {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      page: Number(page),
      passengerCount: Number(minPassengers),
      classification: classification,
      make: make,
      priceMin: price[0],
      priceMax: price[1],
    },
    {
      keepPreviousData: true,
    },
  );

  if (searchResponse.vehicles.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center">
        <p className="text-muted-foreground">
          No vehicles found. Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <section>
      <ul className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 xl:grid-cols-3">
        {searchResponse.vehicles.map((vehicle) => {
          const bookNowParams = new URLSearchParams({
            id: vehicle.id,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
          });

          return (
            <div
              key={vehicle.id}
              className="rounded-md border-t-[3px] border-solid border-amber-300 bg-white p-4 shadow-xl hover:border-amber-400 hover:shadow-none hover:outline hover:outline-1 hover:outline-amber-400"
            >
              <div className="grid place-items-center px-8">
                <div className="custom-ellipsis text-center text-lg font-bold">
                  {vehicle.make} {vehicle.model}
                </div>
                <div className="text-center text-sm">
                  {vehicle.classification}
                </div>
                <div className="space-x-4">
                  <div className="inline-flex items-center space-x-1">
                    <UserRound className="w-4 text-neutral-500" />
                    <span className="text-sm text-neutral-500">
                      {vehicle.max_passengers}
                    </span>
                  </div>
                  <div className="inline-flex items-center space-x-1">
                    <DoorOpen className="w-4 text-neutral-500" />
                    <span className="text-sm text-neutral-500">
                      {vehicle.doors}
                    </span>
                  </div>
                </div>
                <img
                  src={vehicle.thumbnail_url}
                  className="w-full object-cover"
                />
                <Separator className="bg-slate-200" />
              </div>
              <div className="space-x-1 py-3 text-center text-sm">
                <span>Starting at</span>
                <span className="text-xl font-bold">
                  {formatCents(vehicle.hourly_rate_cents)}
                </span>
                /day
              </div>
              <Button
                asChild
                className="w-full rounded-3xl text-lg font-semibold"
              >
                <Link
                  to={{
                    pathname: "/review",
                    search: bookNowParams.toString(),
                  }}
                >
                  See rental options
                </Link>
              </Button>
            </div>
          );
        })}
      </ul>
      <PaginationButtons data={searchResponse.pagination} />
    </section>
  );
};

export { VehicleList };
