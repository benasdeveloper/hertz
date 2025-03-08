import { ErrorFallback } from "@/components/ErrorFallback";
import { MiniPageLayout } from "@/components/Layout/MiniPageLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ConfirmationContent } from "./components/ConfirmationContent";
import { ErrorBoundary } from "react-error-boundary";

const Confirmation = () => {
  return (
    <MiniPageLayout
      title="Confirmed"
      subtitle="Your reservation is confirmed. Enjoy your trip!"
    >
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load reservation" />}
      >
        <Suspense fallback={<Skeleton className="h-full w-full" />}>
          <ConfirmationContent />
        </Suspense>
      </ErrorBoundary>
    </MiniPageLayout>
  );
};

export { Confirmation };
