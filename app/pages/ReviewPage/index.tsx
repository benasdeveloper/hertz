import { MiniPageLayout } from "@/components/Layout/MiniPageLayout";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/ErrorFallback";
import { ReviewContent } from "./components/ReviewContent";

const ReviewPage = () => {
  return (
    <MiniPageLayout
      title="Almost there"
      subtitle="Your adventure is about to begin! Please confirm your reservation below."
    >
      <ErrorBoundary
        fallback={<ErrorFallback message="Failed to load reservation" />}
      >
        <Suspense
          fallback={
            <div className="flex flex-col gap-4">
              <Skeleton className="h-[178px] w-full rounded" />
              <Skeleton className="h-[178px] w-full rounded" />
              <Skeleton className="h-[178px] w-full rounded" />
            </div>
          }
        >
          <ReviewContent />
        </Suspense>
      </ErrorBoundary>
    </MiniPageLayout>
  );
};

export { ReviewPage };
