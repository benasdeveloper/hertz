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
    <div className="container max-w-2xl mx-auto py-8 px-8">
      <div className="flex flex-col gap-4 py-8 items-center text-center">
        <h1 className="text-6xl font-black leading-tight">{title}</h1>
        <p className="max-w-lg text-xl font-light tracking-wide text-accent-foreground">
          {subtitle}
        </p>
      </div>

      {children}
    </div>
  );
}
