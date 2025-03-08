import { ReactNode } from "react";

interface WrapperFilterProps {
  children: ReactNode | ReactNode[];
  label: string;
}

const WrapperFilter = ({
  label = "Some title",
  children,
}: WrapperFilterProps) => {
  return (
    <div className="mt-12">
      <span className="block pb-4 text-lg">{label}</span>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
};

export { WrapperFilter };
