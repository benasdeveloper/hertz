import { ReactNode } from "react";
import { FixedHeader } from "@/components/Base/FixedHeader";
import { Footer } from "@/components/Layout/Footer";

interface MainPageProps {
  children: ReactNode;
  leftColumn: ReactNode;
}

export const MainPage = ({ children, leftColumn }: MainPageProps) => {
  return (
    <>
      <FixedHeader />
      <div className="mx-auto grid grid-cols-4 gap-12 px-4 lg:w-4/5 lg:px-0">
        {leftColumn}
        {children}
      </div>
      <Footer />
    </>
  );
};
