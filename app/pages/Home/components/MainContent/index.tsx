import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

const MainContent = ({ children }: MainContentProps) => {
  return (
    <section className="col-span-4 lg:col-span-3 lg:col-start-2 lg:col-end-5">
      <div className="w-3/4 py-4">
        <span className="w-3/4 text-4xl font-semibold">Pick your car</span>
        <span className="block w-3/4 text-xs text-neutral-400">
          Taxes and fees to be included at checkout.
        </span>
      </div>
      <div>{children}</div>
    </section>
  );
};

export { MainContent };
