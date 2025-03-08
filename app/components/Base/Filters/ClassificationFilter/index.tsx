import { FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { WrapperFilter } from "../WrapperFilter";
import { FormValues } from "@/context/FormFilterContext/types";
import { useFormContext } from "react-hook-form";
import { useFilterContext } from "@/hooks/useFilterContext";

const ClassificationFilter = () => {
  const form = useFormContext<FormValues>();
  const { classifications } = useFilterContext();

  return (
    <FormField
      control={form.control}
      name="classification"
      render={({ field }) => (
        <FormItem className="w-full">
          <FormControl>
            <WrapperFilter label="Vehicle Types">
              <Select
                onValueChange={(value) => field.onChange([value])}
                value={field.value?.[0] || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {classifications.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </WrapperFilter>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { ClassificationFilter };
