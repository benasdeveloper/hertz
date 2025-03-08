import { BreadcrumbArea } from "@/components/Base/Breadcrumb";
import { ClassificationFilter } from "@/components/Base/Filters/ClassificationFilter";
import { MakesFilter } from "@/components/Base/Filters/MakeFilter";
import { PriceRange } from "@/components/Base/Filters/PriceRange";
import { PassengersFilter } from "@/components/Base/Filters/Passengers";
import { LeftDrawerFilters } from "@/components/Base/LeftDrawerFilters";
import { Button } from "@/components/ui/button";
import { FormValues } from "@/context/FormFilterContext/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useFormContext } from "react-hook-form";
import { useState } from "react";

const LeftColumnContent = () => {
  const form = useFormContext<FormValues>();
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [rangeSliderValue, setRangeSliderValue] = useState<[number, number]>(
    form.getValues("price") as [number, number],
  );

  const handleRangeSliderValues = (val: [number, number]) => {
    setRangeSliderValue(val);
  };

  const handleResetRange = () => {
    setRangeSliderValue(form.getValues("price"));
  };

  return (
    <div className="col-start-1 col-end-5 lg:col-end-2">
      <BreadcrumbArea active={isDesktop} />
      <div className="mt-10 flex items-end gap-4">
        {!isDesktop && (
          <LeftDrawerFilters
            content={[
              <PriceRange
                key={"PriceRange"}
                handleRangeSliderValues={handleRangeSliderValues}
                rangeSliderValue={rangeSliderValue}
              />,
              <ClassificationFilter key={"ClassificationFilter"} />,
              <MakesFilter key={"MakesFilter"} />,
              <PassengersFilter key={"PassengersFilter"} />,
              <Button
                key={"buttonDrawer"}
                variant={"secondary"}
                className="mt-12 w-full"
                onClick={() => {
                  form.reset();
                  handleResetRange();
                }}
              >
                Reset filters
              </Button>,
            ]}
          >
            <Button className="mt-4 w-full" variant={"outline"}>
              Filter options
            </Button>
          </LeftDrawerFilters>
        )}
      </div>

      {isDesktop && (
        <>
          <PriceRange
            key={"PriceRange"}
            handleRangeSliderValues={handleRangeSliderValues}
            rangeSliderValue={rangeSliderValue}
          />
          <ClassificationFilter key={"ClassificationFilter"} />
          <MakesFilter key={"MakesFilter"} />
          <PassengersFilter key={"PassengersFilter"} />
          <Button
            variant={"secondary"}
            className="mt-12 w-full"
            onClick={() => {
              form.reset();
              handleResetRange();
            }}
          >
            Reset filters
          </Button>
        </>
      )}
    </div>
  );
};

export { LeftColumnContent };
