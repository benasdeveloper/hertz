import { VehicleDetails } from "@/components/Base/VehicleDetails";
import { formatCents } from "@/lib/formatters";
import { trpc } from "@/trpc";
import { Separator } from "@radix-ui/react-separator";
import { ArrowRightIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";

const ConfirmationContent = () => {
  const { reservationId } = useParams();

  const [reservation] = trpc.reservations.get.useSuspenseQuery({
    id: reservationId!,
  });

  const { vehicle } = reservation;

  return (
    <div className="flex flex-col gap-8">
      <VehicleDetails vehicle={vehicle} />

      <Separator />

      <div className="space-y-6">
        <dl className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <dt className="text-sm text-gray-600">Start</dt>
            <dd>{format(reservation.start_time, "PPpp")}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">End</dt>
            <dd>{format(reservation.end_time, "PPpp")}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-600">Total Cost</dt>
            <dd>{formatCents(reservation.total_price_cents || 0)}</dd>
          </div>
        </dl>

        <div className="flex flex-col items-center pt-12">
          <Button variant="link" asChild>
            <Link to="/">
              Return home <ArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ConfirmationContent };
