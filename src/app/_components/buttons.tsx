import clsx from "clsx";
import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import Link from "next/link";

type PlayButtonPropsType = {
  href: string;
};

type YesButtonPropsType = {
  onClickYes?: () => void;
  classNameYes?: string;
  disabledYes?: boolean;
};

type NoButtonPropsType = {
  onClickNo?: () => void;
  classNameNo?: string;
};

type YesNoButtonPropsType = YesButtonPropsType & NoButtonPropsType;

export function YesButton(props: YesButtonPropsType) {
  return (
    <button
      className={clsx([
        "m-4 flex w-44 items-center justify-center gap-2 rounded-md bg-green-500 py-2 text-2xl font-semibold text-white transition hover:scale-105 hover:bg-green-400 active:scale-95 active:bg-green-600 disabled:bg-gray-500 disabled:text-gray-200 disabled:hover:bg-gray-400 disabled:active:bg-gray-600",
        props.classNameYes,
      ])}
      onClick={props.onClickYes}
      disabled={props.disabledYes}
    >
      <CheckIcon />
      <span>Yep!</span>
    </button>
  );
}

export function NoButton(props: NoButtonPropsType) {
  return (
    <button
      className={clsx([
        "m-4 flex w-44 items-center justify-center gap-2 rounded-md border border-red-400 py-2 text-2xl font-semibold text-red-400 transition hover:scale-105 active:scale-95",
        props.classNameNo,
      ])}
      onClick={props.onClickNo}
    >
      <XIcon />
      <span>Nope!</span>
    </button>
  );
}

export function PlayButton(props: PlayButtonPropsType) {
  const { href } = props;

  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-md bg-emerald-500 px-10 py-4 text-2xl font-semibold transition hover:scale-105 hover:bg-emerald-400 active:scale-95 active:bg-emerald-600"
    >
      <PlayIcon className="fill-white" />
      <span>Start</span>
    </Link>
  );
}

export function YesNoButtons(props: YesNoButtonPropsType) {
  return (
    <div className="flex items-center gap-2">
      <NoButton onClickNo={props.onClickNo} />
      <YesButton onClickYes={props.onClickYes} />
    </div>
  );
}
