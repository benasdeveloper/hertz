import { FormValues } from "@/context/FormFilterContext/types";
import { Pagination } from "@/trpc";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

const PaginationButtons = ({ data }: { data: Pagination }) => {
  const form = useFormContext<FormValues>();
  const page = form.watch("page");

  return (
    <div className="my-8 flex items-center justify-end gap-4 rounded-md bg-neutral-50">
      <Button
        variant="link"
        onClick={() => form.setValue("page", page - 1)}
        disabled={page === 1}
      >
        Previous
      </Button>
      <div className="h-6 w-[1px] bg-neutral-200" />
      <Button
        variant="link"
        onClick={() => form.setValue("page", page + 1)}
        disabled={page === data.totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export { PaginationButtons };
