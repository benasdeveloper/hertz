import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { WrapperFilter } from "../WrapperFilter";
import { FormValues } from "@/context/FormFilterContext/types";
import { useFilterContext } from "@/hooks/useFilterContext";
import { useFormContext } from "react-hook-form";

const PassengersFilter = () => {
  const form = useFormContext<FormValues>();
  const { passengerCounts } = useFilterContext();

  return (
    <FormField
      control={form.control}
      name="minPassengers"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <WrapperFilter label="Passengers">
              {passengerCounts.map((item) => {
                const isSelected = Number(field.value) === item;

                return (
                  <Button
                    key={item}
                    variant={isSelected ? "secondary" : "outline"}
                    onClick={() => field.onChange(item)}
                  >
                    {item}
                  </Button>
                );
              })}
            </WrapperFilter>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { PassengersFilter };
