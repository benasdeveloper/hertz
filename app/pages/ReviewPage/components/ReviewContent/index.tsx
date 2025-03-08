import { VehicleDetails } from "@/components/Base/VehicleDetails";
import { formatCents } from "@/lib/formatters";
import { trpc } from "@/trpc";
import { Separator } from "@radix-ui/react-separator";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Timeline } from "../Timeline";

const ReviewContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
  const start = searchParams.get("start") ?? "";
  const end = searchParams.get("end") ?? "";

  const startDate = new Date(start);
  const endDate = new Date(end);

  const [vehicle] = trpc.vehicles.get.useSuspenseQuery({ id: id! });

  const [quote] = trpc.reservations.quote.useSuspenseQuery({
    vehicleId: id!,
    startTime: startDate.toISOString(),
    endTime: endDate.toISOString(),
  });

  const createReservation = trpc.reservations.create.useMutation();

  const handleConfirm = async () => {
    try {
      const reservation = await createReservation.mutateAsync({
        vehicleId: id!,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
      });

      navigate(`/confirmation/${reservation.id}`);
    } catch (error) {
      console.error("Reservation failed:", error);
    }
  };

  const formattedDuration = formatDuration(
    intervalToDuration({
      start: startDate,
      end: endDate,
    }),
    { delimiter: ", " },
  );

  return (
    <div className="flex flex-col gap-8">
      <VehicleDetails vehicle={vehicle} />

      <Separator />

      <div className="space-y-6">
        <h3 className="mb-4 text-2xl font-semibold">Reservation Summary</h3>
        <div className="grid grid-cols-2 gap-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-600">Hourly Rate</dt>
              <dd>
                <span className="text-lg">
                  {formatCents(vehicle.hourly_rate_cents)}
                </span>
                <span className="text-xs">/hr</span>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Duration</dt>
              <dd>{formattedDuration}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-600">Total Cost</dt>
              <dd className="text-2xl font-medium tracking-tight">
                {formatCents(quote?.totalPriceCents || 0)}
              </dd>
            </div>
          </dl>

          <Timeline startDate={startDate} endDate={endDate} />
        </div>

        <Button size="lg" className="w-full" onClick={handleConfirm}>
          Confirm reservation
        </Button>
      </div>
    </div>
  );
};

export { ReviewContent };
