import { format } from "date-fns";

const Timeline = ({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) => {
  return (
    <div className="relative flex">
      <div className="absolute bottom-1.5 top-1.5 flex flex-col items-center">
        <div className="z-10 h-3 w-3 rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-400"></div>
        <div className="flex-grow border-l-2 border-dotted border-gray-300"></div>
        <div className="z-10 h-3 w-3 rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-400"></div>
        <div className="flex-grow border-l-2 border-dotted border-gray-300"></div>
        <div className="z-10 h-3 w-3 rounded-full border-2 border-white bg-blue-500 ring-1 ring-blue-400"></div>
      </div>
      <div className="ml-8 flex h-full flex-col justify-between gap-4">
        <div>
          <span className="text-sm text-gray-600">Pick-up</span>
          <p className="font-medium">{format(startDate, "PPpp")}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Rental period</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Drop-off</span>
          <p className="font-medium">{format(endDate, "PPpp")}</p>
        </div>
      </div>
    </div>
  );
};

export { Timeline };
