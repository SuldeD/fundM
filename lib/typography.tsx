import { cn } from "./utils";

export const Typography = () => {
  return <div>typography</div>;
};

export function Title({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl",
        className
      )}
    >
      {text}
    </div>
  );
}

export function Muted({ text }: { text: string }) {
  return <p className="text-sm text-mutedForeground">{text}</p>;
}
