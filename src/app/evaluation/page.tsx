"use client";

import { TriangleAlertIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { confirmQuestion, getInitialQuestionQueue } from "~/utils/functions";
import ColorCircle from "../_components/color-circle";
import { ColorDropdown } from "../_components/color-dropdown";
import { YesButton, YesNoButtons } from "../_components/buttons";
import {
  type SingleColorData,
  type QuestionData,
  QuestionType,
  type RainbowData,
} from "~/utils/types";
import ColorGraph from "../_components/color-graph";

const initColorData = {
  red: [],
  orange: [],
  yellow: [],
  green: [],
  cyan: [],
  blue: [],
  purple: [],
  pink: [],
  brown: [],
};

export default function ColorEvaluation() {
  const [data, setData] = useState<RainbowData>(initColorData);
  const [questionQueue, setQuestionQueue] = useState<QuestionData[]>([]);
  const [selectedColorName, setSelectedColorName] = useState<
    string | undefined
  >(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuestionQueue(getInitialQuestionQueue());
  }, []);

  function confirmPositive() {
    console.log("Confirm > Positive");
    const copiedQuestionQueue = JSON.parse(
      JSON.stringify(questionQueue),
    ) as QuestionData[];
    const thisQuestion = copiedQuestionQueue.pop();

    if (thisQuestion === undefined) {
      setError("No question.");
      return;
    } else {
      setError("");
    }

    try {
      const [newData, newQuestions] = confirmQuestion(
        data,
        thisQuestion,
        selectedColorName,
        true,
      );
      setSelectedColorName(undefined);
      setData(newData);
      setQuestionQueue([...copiedQuestionQueue, ...newQuestions]);
    } catch (e: unknown) {
      setError((e as { message: string }).message);
    }
  }

  function confirmNegative() {
    console.log("Confirm > Negative");
    const copiedQuestionQueue = JSON.parse(
      JSON.stringify(questionQueue),
    ) as QuestionData[];
    const thisQuestion = copiedQuestionQueue.pop();

    if (thisQuestion === undefined) {
      setError("No question.");
      return;
    } else {
      setError("");
    }

    try {
      const [newData, newQuestions] = confirmQuestion(
        data,
        thisQuestion,
        selectedColorName,
        false,
      );
      setSelectedColorName(undefined);
      setData(newData);
      setQuestionQueue([...copiedQuestionQueue, ...newQuestions]);
    } catch (e: unknown) {
      setError((e as { message: string }).message);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-12 bg-gradient-to-bl from-amber-100 to-amber-50 to-50% text-white">
      {error !== "" ? (
        <div className="absolute top-10 flex items-center gap-6 rounded-md border-red-400 text-red-400">
          <TriangleAlertIcon />
          <span>{error}</span>
        </div>
      ) : (
        <></>
      )}
      {questionQueue[0] === undefined ? (
        <></>
      ) : (
        <>
          <ColorCircle color={questionQueue[0].colorValue} />
          <Question
            confirmPositive={confirmPositive}
            confirmNegative={confirmNegative}
            questionData={questionQueue[0]}
            selectColor={setSelectedColorName}
            selectedColorName={selectedColorName ?? ""}
          />
        </>
      )}
      <ColorGraph data={data} />
    </main>
  );
}

type QuestionPropsType = {
  questionData: QuestionData;
  selectedColorName?: string;
  selectColor: (newValue: string | undefined) => void;
  confirmPositive: () => void;
  confirmNegative: () => void;
};

function Question(props: QuestionPropsType) {
  const {
    questionData,
    selectedColorName,
    selectColor,
    confirmNegative,
    confirmPositive,
  } = props;

  switch (questionData.questionType) {
    case QuestionType.POINT_CREATE:
      return (
        <div>
          <div className="flex items-center gap-1 text-xl text-black">
            <span>{questionData.questionStringPre}</span>
            <ColorDropdown
              selectColor={selectColor}
              selectedColor={selectedColorName}
            />
            <span>{questionData.questionStringPost}</span>
          </div>

          <YesButton
            classNameYes="mx-auto"
            disabledYes={selectedColorName === undefined}
            onClickYes={confirmPositive}
          />
        </div>
      );
    case QuestionType.RANGE_CONFIRM:
    case QuestionType.RANGE_INVERT:
      return (
        <div>
          <div className="flex items-center gap-1 text-xl text-black">
            <span>{questionData.questionStringPre}</span>
            <span>{questionData.suspectedColor}</span>
            <span>{questionData.questionStringPost}</span>
          </div>

          <YesNoButtons
            onClickNo={confirmNegative}
            onClickYes={confirmPositive}
          />
        </div>
      );
    default:
      return <></>;
  }
}
