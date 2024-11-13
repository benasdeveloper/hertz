import { useFormContext } from "react-hook-form";
import { useMemo } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/classnames.ts";
import { addMinutes, format, isBefore, isSameDay, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { FormValues } from "@/components/search/form.tsx";

function getTimeOptions(startDate: Date) {
  const start = startOfDay(startDate);
  return Array.from({ length: 96 }, (_, i) => {
    const date = addMinutes(start, i * 15);

    const value = format(date, "HH:mm");
    const label = format(date, "p");

    const now = new Date();
    const isToday = isSameDay(startDate, now);
    const isDisabled = isToday && isBefore(date, now);

    return { value, label, isDisabled };
  });
}

export function TimeRangeFilters() {
  const form = useFormContext<FormValues>();
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const startTimeOptions = useMemo(
    () => getTimeOptions(startDate),
    [startDate],
  );
  const endTimeOptions = useMemo(() => getTimeOptions(endDate), [endDate]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pick-up date</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex w-full gap-4 pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="startTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pick-up time</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {startTimeOptions.map((time) => (
                    <SelectItem
                      key={time.value}
                      value={time.value}
                      disabled={time.isDisabled}
                    >
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Drop-off date</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex w-full gap-4 pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(value) => {
                      if (value) {
                        field.onChange(value);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="endTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Drop-off time</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {endTimeOptions.map((time) => (
                    <SelectItem
                      key={time.value}
                      value={time.value}
                      disabled={time.isDisabled}
                    >
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
