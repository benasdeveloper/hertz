import { trpc } from "@/trpc";
import { createContext, ReactNode } from "react";

interface FilterContextType {
  makes: string[];
  classifications: string[];
  passengerCounts: number[];
}

const FilterContext = createContext<FilterContextType | null>(null);

export const FilterContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { data: response, error } = trpc.vehicles.options.useQuery();

  if (error) {
    console.error("TRPC Error:", error);
  }

  const makes = response?.makes || [];
  const classifications = response?.classifications || [];
  const passengerCounts = response?.passengerCounts || [];

  return (
    <FilterContext.Provider value={{ makes, classifications, passengerCounts }}>
      {children}
    </FilterContext.Provider>
  );
};

export { FilterContext };
