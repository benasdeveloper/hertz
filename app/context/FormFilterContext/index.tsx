import { Form } from "@/components/ui/form.tsx";
import { roundToNearest30Minutes } from "@/lib/times";
import { addHours, addDays, format } from "date-fns";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { FormValues } from "./types";

interface FormFilterContextPros {
  children: ReactNode;
}

const FormFilterContext = ({ children }: FormFilterContextPros) => {
  const [initialStartDateAndTime] = useState(() =>
    roundToNearest30Minutes(addHours(new Date(), 1)),
  );

  const [initialEndDateAndTime] = useState(() =>
    addDays(initialStartDateAndTime, 1),
  );

  const form = useForm<FormValues>({
    defaultValues: {
      startDate: initialStartDateAndTime,
      startTime: format(initialStartDateAndTime, "p"),
      endDate: initialEndDateAndTime,
      endTime: format(initialEndDateAndTime, "p"),
      minPassengers: 1,
      classification: [],
      make: [],
      price: [15, 75],
      page: 1,
    },
  });

  return <Form {...form}>{children}</Form>;
};

export { FormFilterContext };
