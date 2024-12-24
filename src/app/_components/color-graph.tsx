import clsx from "clsx";
import type { RainbowData } from "~/utils/types";

export default function ColorGraph({
  className,
  data,
}: {
  className?: string;
  data: RainbowData;
}) {
  return (
    <div className="mx-auto w-[720px]">
      <div className="relative w-full">
        {Object.keys(data).map((color) =>
          data[color]!.map((datapoint, idx) =>
            datapoint.type === "point" ? (
              <div
                className="absolute z-0 flex h-28 w-[2px] items-end justify-center bg-black/50"
                style={{ left: datapoint.value }}
                key={idx}
              >
                <div className="w-fit rounded-lg bg-black px-2 text-center">
                  {color} <br />
                  {datapoint.value}
                </div>
              </div>
            ) : (
              <div
                className="absolute z-0 flex h-28 items-end justify-center bg-black/50"
                style={{
                  left: datapoint.start,
                  width: datapoint.end - datapoint.start,
                }}
                key={idx}
              >
                <div className="min-w-24 rounded-lg bg-black px-2 text-center">
                  {color} <br /> {datapoint.start} - {datapoint.end}
                </div>
              </div>
            ),
          ),
        )}
      </div>
      <div className="z-10 flex items-center">
        <div
          className={clsx(["h-[50px] w-[360px]", className])}
          style={{
            background:
              "linear-gradient(to right, red, orange, yellow, lime, cyan, blue, magenta, red)",
          }}
        />
        <div
          className={clsx(["h-[50px] w-[360px]", className])}
          style={{
            background:
              "linear-gradient(to right, red, orange, yellow, lime, cyan, blue, magenta, red)",
          }}
        />
      </div>
    </div>
  );
}
