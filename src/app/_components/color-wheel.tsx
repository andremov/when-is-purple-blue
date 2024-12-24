import clsx from "clsx";

export default function ColorWheel({ className }: { className?: string }) {
  return (
    <div
      className={clsx([
        "h-[300px] w-[300px] animate-spin rounded-full",
        className,
      ])}
      style={{
        animationDuration: "40s",
        background:
          "conic-gradient(red, orange, yellow, lime, cyan, blue, magenta, red)",
      }}
    />
  );
}
