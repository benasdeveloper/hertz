import { FixedHeader } from "@/components/Base/FixedHeader";
import { Footer } from "@/components/Layout/Footer";

export interface MiniPageLayoutProps {
  title: React.ReactNode;
  subtitle: React.ReactNode;
  children: React.ReactNode;
}

export function MiniPageLayout({
  title,
  subtitle,
  children,
}: MiniPageLayoutProps) {
  return (
    <>
      <FixedHeader />
      <div className="container mx-auto max-w-2xl px-8 py-8">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <h1 className="text-6xl font-black leading-tight">{title}</h1>
          <p className="max-w-lg text-xl font-light tracking-wide text-accent-foreground">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
      <Footer />
    </>
  );
}
