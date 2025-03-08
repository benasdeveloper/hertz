import { ErrorFallback } from "@/components/ErrorFallback";
import { VehicleList } from "@/components/Base/VehicleList";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { MainPage } from "@/components/Layout/MainPage";
import { LeftColumnContent } from "./components/LeftColumnContent";
import { MainContent } from "./components/MainContent";

const Home = () => {
  return (
    <MainPage leftColumn={<LeftColumnContent />}>
      <MainContent>
        <ErrorBoundary
          fallback={<ErrorFallback message="Failed to load vehicles" />}
        >
          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                <Skeleton className="h-[178px] w-full rounded" />
                <Skeleton className="h-[178px] w-full rounded" />
                <Skeleton className="h-[178px] w-full rounded" />
                <Skeleton className="h-[178px] w-full rounded" />
              </div>
            }
          >
            <VehicleList />
          </Suspense>
        </ErrorBoundary>
      </MainContent>
    </MainPage>
  );
};

export { Home };
