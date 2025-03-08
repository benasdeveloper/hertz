import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReviewPage } from "./pages/ReviewPage";
import { trpc } from "./trpc";
import { Confirmation } from "@/pages/Confirmation";
import { Home } from "./pages/Home";
import { FilterContextProvider } from "./context/FilterContext";
import { FormFilterContext } from "@/context/FormFilterContext";

function App() {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/trpc",
        }),
      ],
    }),
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <FormFilterContext>
          <FilterContextProvider>
            <Router>
              <Routes>
                <Route index element={<Home />} />
                <Route path="/review" element={<ReviewPage />} />
                <Route
                  path="/confirmation/:reservationId"
                  element={<Confirmation />}
                />
              </Routes>
            </Router>
          </FilterContextProvider>
        </FormFilterContext>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
