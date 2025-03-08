import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { RangeSlider } from "@/components/ui/slider";
import { WrapperFilter } from "../WrapperFilter";
import { FormValues } from "@/context/FormFilterContext/types";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { formatCents } from "@/lib/formatters";

interface PriceRangeProps {
  handleRangeSliderValues: (val: [number, number]) => void;
  rangeSliderValue: [number, number];
}

const PriceRange = ({
  handleRangeSliderValues,
  rangeSliderValue,
}: PriceRangeProps) => {
  const form = useFormContext<FormValues>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      form.setValue("price", rangeSliderValue, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [rangeSliderValue, form]);

  return (
    <FormField
      control={form.control}
      name="price"
      render={() => (
        <FormItem>
          <FormControl>
            <WrapperFilter label="Price Range">
              <div className="flex w-full gap-4">
                <p className="text-sm text-neutral-400">
                  {formatCents(rangeSliderValue[0] * 100)}
                </p>
                <RangeSlider
                  value={rangeSliderValue}
                  onValueChange={(val: number[]) =>
                    handleRangeSliderValues([val[0], val[1]])
                  }
                  min={0}
                  max={100}
                  step={1}
                />
                <p className="text-sm text-neutral-400">
                  {formatCents(rangeSliderValue[1] * 100)}
                </p>
              </div>
            </WrapperFilter>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export { PriceRange };
