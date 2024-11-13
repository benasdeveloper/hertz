import { Button } from "./ui/button";

export function ErrorFallback({ message }: { message: React.ReactNode }) {
  return (
    <div className="space-y-4 p-8 text-center ">
      <p className="text-lg text-red-700">{message}</p>
      <Button variant="ghost" onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  );
}
