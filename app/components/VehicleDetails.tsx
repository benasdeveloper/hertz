import type { Vehicle } from "@/trpc.ts";

export interface VehicleDetailsProps {
  vehicle: Vehicle;
}

export function VehicleDetails({ vehicle }: VehicleDetailsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="flex flex-col items-center">
        <img
          src={vehicle.thumbnail_url}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full max-w-[140px] rounded-full bg-blue-50 p-4 mb-4"
        />
      </div>
      <div className="flex flex-col ml-4 items-center md:items-start">
        <h2 className="text-3xl font-bold text-center md:text-left leading-tight">
          {vehicle.make} {vehicle.model}
        </h2>
        <dl className="max-w-lg md:max-w-unset grid grid-cols-3 gap-12 mt-4">
          <div>
            <dt className="text-sm text-gray-600">Year</dt>
            <dd>{vehicle.year}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Passengers</dt>
            <dd>{vehicle.max_passengers}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Class</dt>
            <dd>{vehicle.classification}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
