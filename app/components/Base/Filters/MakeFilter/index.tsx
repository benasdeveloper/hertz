import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { WrapperFilter } from "../WrapperFilter";
import { FormValues } from "@/context/FormFilterContext/types";
import { useFormContext } from "react-hook-form";
import { useFilterContext } from "@/hooks/useFilterContext";

const MakesFilter = () => {
  const form = useFormContext<FormValues>();
  const { makes } = useFilterContext();

  return (
    <FormField
      control={form.control}
      name="make"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <WrapperFilter label="Make">
              {makes.map((item) => {
                const isSelected = Array.isArray(field.value)
                  ? field.value.includes(item)
                  : field.value === item;

                return (
                  <Button
                    key={item}
                    variant={isSelected ? "secondary" : "outline"}
                    onClick={() => {
                      field.onChange(
                        isSelected
                          ? field.value.filter((val) => val !== item)
                          : [...(field.value || []), item],
                      );
                    }}
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

export { MakesFilter };
