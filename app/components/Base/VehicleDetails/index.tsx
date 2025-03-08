import type { Vehicle } from "@/trpc.ts";

export interface VehicleDetailsProps {
  vehicle: Vehicle;
}

const VehicleDetails = ({ vehicle }: VehicleDetailsProps) => {
  return (
    <div className="flex flex-col items-center gap-8 md:flex-row">
      <div className="flex flex-col items-center">
        <img
          src={vehicle.thumbnail_url}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="mb-4 w-full max-w-[140px] rounded-full bg-blue-50 p-4"
        />
      </div>
      <div className="ml-4 flex flex-col items-center md:items-start">
        <h2 className="text-center text-3xl font-bold leading-tight md:text-left">
          {vehicle.make} {vehicle.model}
        </h2>
        <dl className="md:max-w-unset mt-4 grid max-w-lg grid-cols-3 gap-12">
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
};

export { VehicleDetails };
