import { SearchPage } from "@/pages/SearchPage.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/react-query";
import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ReviewPage } from "./pages/ReviewPage";
import { trpc } from "./trpc";
import { ConfirmationPage } from "@/pages/ConfirmationPage.tsx";

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
        <Router>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/review" element={<ReviewPage />} />
            <Route
              path="/confirmation/:reservationId"
              element={<ConfirmationPage />}
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
