import { ErrorFallback } from "@/components/ErrorFallback";
import { MiniPageLayout } from "@/components/MiniPageLayout";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleDetails } from "@/components/VehicleDetails.tsx";
import { formatCents } from "@/lib/formatters.tsx";
import { trpc } from "@/trpc.ts";
import { format } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Link, useParams } from "react-router-dom";

function Content() {
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
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              Return home <ArrowRightIcon className="size-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ConfirmationPage() {
  return (
    <MiniPageLayout
      title="Confirmed"
      subtitle="Your reservation is confirmed. Enjoy your trip!"
    >
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load reservation" />}
      >
        <Suspense fallback={<Skeleton className="w-full h-full" />}>
          <Content />
        </Suspense>
      </ErrorBoundary>
    </MiniPageLayout>
  );
}
