import {
  type QuestionData,
  QuestionType,
  type RainbowData,
  type ColorDataPoint,
  type ColorDataRange,
} from "./types";

export function getRandomColorValue(inputData: RainbowData) {
  const ranges = Object.keys(inputData)
    .map((color) =>
      inputData[color]!.map((item) =>
        item.type === "point"
          ? { start: item.value, end: item.value }
          : { start: item.start, end: item.end },
      ),
    )
    .flat();

  let color = Math.floor(Math.random() * 360);
  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index]!;
    if (range.start <= color && range.end >= color) {
      color = Math.floor(Math.random() * 360);
      index = 0;
    }
  }
  return color;
}

export function getInitialQuestionQueue(): QuestionData[] {
  const first = {
    colorValue: getRandomColorValue({}),
    questionType: QuestionType.POINT_CREATE,
    questionStringPre: "This is",
    questionStringPost: ".",
    suspectedColor: undefined,
  };

  return [first];
}

export function confirmQuestion(
  inputData: RainbowData,
  question: QuestionData,
  selected: string | undefined,
  response: boolean,
): [RainbowData, QuestionData[]] {
  const data = JSON.parse(JSON.stringify(inputData)) as RainbowData;
  const newQuestions: QuestionData[] = [];

  if (
    question.questionType === QuestionType.POINT_CREATE ||
    question.questionType === QuestionType.POINT_CLARIFICATION
  ) {
    if (selected === undefined) throw new Error("1- No color selected.");
    if (data[selected] === undefined)
      throw new Error("1- No color data found.");

    const dataRanges = data[selected].filter((item) => item.type === "range");
    const [containingRange] = dataRanges.filter(
      (item) =>
        item.start <= question.colorValue && item.end >= question.colorValue,
    );

    if (containingRange !== undefined) {
      // confirm the range that contains the data point
      containingRange.confirmations.push(question.colorValue);
      containingRange.correct = true;
    } else if (dataRanges.length > 0) {
      const closestDataRange = dataRanges.reduce((closest, current) => {
        const closestDistance = Math.min(
          Math.abs(question.colorValue - closest.start),
          Math.abs(question.colorValue - closest.end),
        );
        const currentDistance = Math.min(
          Math.abs(question.colorValue - current.start),
          Math.abs(question.colorValue - current.end),
        );

        return closestDistance < currentDistance ? closest : current;
      });

      const startDistance = Math.abs(
        closestDataRange.start - question.colorValue,
      );
      const endDistance = Math.abs(closestDataRange.end - question.colorValue);
      if (startDistance < endDistance) {
        const start = Math.min(question.colorValue, closestDataRange.start);
        const end = Math.max(question.colorValue, closestDataRange.start);
        data[selected].push(
          newDataRange({
            start,
            end,
          }),
        );
        newQuestions.push({
          colorValue: start + (end - start) / 2,
          questionType: QuestionType.RANGE_CONFIRM,
          suspectedColor: selected,
          questionStringPre: "Is this also",
          questionStringPost: "?",
        });
      } else {
        const start = Math.min(question.colorValue, closestDataRange.end);
        const end = Math.max(question.colorValue, closestDataRange.end);
        data[selected].push(
          newDataRange({
            start,
            end,
          }),
        );
        newQuestions.push({
          colorValue: start + (end - start) / 2,
          questionType: QuestionType.RANGE_CONFIRM,
          suspectedColor: selected,
          questionStringPre: "Is this also",
          questionStringPost: "?",
        });
      }

      return [data, newQuestions];
    } else if (containingRange === undefined) {
      // add data point
      data[selected].push(newDataPoint({ value: question.colorValue }));
    }

    // check if a range can be created
    const dataPoints = data[selected].filter((item) => item.type === "point");
    if (dataPoints.length > 1) {
      const start = Math.min(...dataPoints.map((i) => i.value));
      const end = Math.max(...dataPoints.map((i) => i.value));

      // add data range
      data[selected] = [newDataRange({ start, end })];

      newQuestions.push({
        colorValue: start + (end - start) / 2,
        questionType: QuestionType.RANGE_CONFIRM,
        suspectedColor: selected,
        questionStringPre: "Is this also",
        questionStringPost: "?",
      });
    } else {
      newQuestions.push({
        colorValue: findFarthestNumber(data),
        questionType: QuestionType.POINT_CREATE,
        questionStringPre: "And this is",
        questionStringPost: ".",
      });
    }
  }

  if (question.questionType === QuestionType.RANGE_CONFIRM) {
    if (question.suspectedColor === undefined)
      throw new Error("2- No color selected.");
    if (data[question.suspectedColor] === undefined)
      throw new Error("2- No color data found.");

    const dataRanges = data[question.suspectedColor]!.filter(
      (item) => item.type === "range",
    );
    const [containingRange] = dataRanges.filter(
      (item) =>
        item.start <= question.colorValue && item.end >= question.colorValue,
    );

    if (response === true) {
      containingRange!.confirmations.push(question.colorValue);

      if (dataRanges.length >= 2) {
        data[question.suspectedColor] = [
          ...mergeRanges(dataRanges),
          ...data[question.suspectedColor]!.filter(
            (item) => item.type === "point",
          ),
        ];
      }

      newQuestions.push({
        colorValue: findFarthestNumber(data),
        questionType: QuestionType.POINT_CREATE,
        questionStringPre: "This is",
        questionStringPost: ".",
        suspectedColor: undefined,
      });
    } else {
      const { start: end, end: start } = containingRange!;

      containingRange!.start = start;
      containingRange!.end = end + 360;

      newQuestions.push({
        colorValue: start + (end + 360 - start) / 2,
        questionType: QuestionType.RANGE_INVERT,
        suspectedColor: question.suspectedColor,
        questionStringPre: "Okay then is this",
        questionStringPost: "?",
      });
    }
  }

  if (question.questionType === QuestionType.RANGE_INVERT) {
    if (question.suspectedColor === undefined)
      throw new Error("3- No color selected.");
    if (data[question.suspectedColor] === undefined)
      throw new Error("3- No color data found.");

    const dataRanges = data[question.suspectedColor]!.filter(
      (item) => item.type === "range",
    );
    const [containingRange] = dataRanges.filter(
      (item) =>
        item.start <= question.colorValue && item.end >= question.colorValue,
    );

    if (response === true) {
      containingRange!.confirmations.push(question.colorValue);

      if (dataRanges.length >= 2) {
        data[question.suspectedColor] = [
          ...mergeRanges(dataRanges),
          ...data[question.suspectedColor]!.filter(
            (item) => item.type === "point",
          ),
        ];
      }

      newQuestions.push({
        colorValue: findFarthestNumber(data),
        questionType: QuestionType.POINT_CREATE,
        questionStringPre: "This is",
        questionStringPost: ".",
        suspectedColor: undefined,
      });
    } else {
      // throw new Error("What?");/
      const { start: end, end: start } = containingRange!;

      containingRange!.start = start;
      containingRange!.end = end - 360;

      newQuestions.push({
        colorValue: start + (end - 360 - start) / 2,
        questionType: QuestionType.RANGE_INVERT,
        suspectedColor: question.suspectedColor,
        questionStringPre: "Okay then is this",
        questionStringPost: "?",
      });
    }
  }

  return [data, newQuestions];
}

function findFarthestNumber(
  inputData: RainbowData,
  min = 0,
  max = 360,
): number {
  const ranges = Object.keys(inputData)
    .map((color) =>
      inputData[color]!.map((item) =>
        item.type === "point"
          ? { start: item.value, end: item.value }
          : { start: item.start, end: item.end },
      ),
    )
    .flat();

  if (ranges.length === 0) getRandomColorValue(inputData);

  // Sort ranges by their start values
  ranges.sort((a, b) => a.start - b.start);

  let farthestPoint = min; // Default to the lower boundary
  let maxDistance = 0;

  // Check the gap before the first range
  const lastRangeEnd = ranges[ranges.length - 1]!.end - 360;
  if (ranges[0]!.start > min) {
    const distance = Math.abs(ranges[0]!.start - lastRangeEnd);
    if (distance > maxDistance) {
      maxDistance = distance;
      farthestPoint = lastRangeEnd + distance / 2;
      if (farthestPoint < 0) farthestPoint += 360;
    }
  }

  // Check gaps between ranges
  for (let i = 0; i < ranges.length - 1; i++) {
    const gapStart = ranges[i]!.end + 1;
    const gapEnd = ranges[i + 1]!.start - 1;

    if (gapStart <= gapEnd) {
      const midpoint = Math.floor((gapStart + gapEnd) / 2);
      const distance = gapEnd - gapStart + 1;

      if (distance > maxDistance) {
        maxDistance = distance;
        farthestPoint = midpoint;
      }
    }
  }

  return farthestPoint;
}

function newDataPoint({ value }: Omit<ColorDataPoint, "type">): ColorDataPoint {
  return {
    type: "point",
    value,
  };
}

function newDataRange({
  start,
  end,
}: Omit<ColorDataRange, "type" | "correct" | "confirmations">): ColorDataRange {
  return {
    confirmations: [],
    correct: undefined,
    end,
    start,
    type: "range",
  };
}

function mergeRanges(ranges: ColorDataRange[]): ColorDataRange[] {
  if (!ranges || ranges.length === 0) return [];

  // Sort by start value
  ranges.sort((a, b) => a.start - b.start);

  const merged: ColorDataRange[] = [ranges[0]!];

  for (let i = 1; i < ranges.length; i++) {
    const prev = merged[merged.length - 1]!;
    const curr = ranges[i]!;

    // Merge overlapping or contiguous ranges
    if (curr.start <= prev.end + 1) {
      prev.confirmations.push(Math.min(prev.end, curr.end));
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(curr);
    }
  }

  return merged;
}
