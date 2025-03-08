interface ReservedDateProps {
  compData: {
    title: string;
    date?: string;
    hour?: string;
  };
}

const ReservedDate = ({
  compData: { title, date, hour },
}: ReservedDateProps) => {
  return (
    <div>
      <p className="text-center font-semibold uppercase text-amber-300">
        {title}
      </p>
      <span className="flex gap-2 whitespace-nowrap text-sm text-neutral-500">
        <span>{date ?? "-"}</span>
        <span>|</span>
        <span>{hour ?? "-"}</span>
      </span>
    </div>
  );
};

export default ReservedDate;
