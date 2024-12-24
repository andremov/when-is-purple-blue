"use client";

export default function ColorCircle({ color }: { color: number }) {
  return (
    <div
      className="flex h-[100px] w-[100px] items-center justify-center rounded-full text-white"
      style={{
        backgroundColor: `hsl(${color}, 100%, 50%)`,
      }}
    >
      {color}
    </div>
  );
}
