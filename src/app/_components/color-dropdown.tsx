import type { ChangeEvent } from "react";

const colorOptions = [
  "red",
  "orange",
  "yellow",
  "green",
  "cyan",
  "blue",
  "purple",
  "pink",
  "brown",
];

type ColorDropdownPropsType = {
  selectedColor?: string;
  selectColor: (newColor: string | undefined) => void;
};

export function ColorDropdown(props: ColorDropdownPropsType) {
  return (
    <select
      className="mx-2 w-52 rounded-md px-4 py-2"
      value={props.selectedColor}
      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
        props.selectColor(e.target.value)
      }
    >
      <option value={""} className="text-gray-400 opacity-60">
        Select a color
      </option>
      {colorOptions.map((color) => (
        <option key={color} value={color}>
          {color}
        </option>
      ))}
    </select>
  );
}
