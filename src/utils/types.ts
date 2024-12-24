export type RainbowData = Record<string, SingleColorData>;

export type SingleColorData = (ColorDataPoint | ColorDataRange)[];

export type ColorDataPoint = {
  type: "point";
  value: number;
};

export type ColorDataRange = {
  type: "range";
  start: number;
  end: number;
  confirmations: number[];
  correct: boolean | undefined;
};

export enum QuestionType {
  POINT_CREATE = 0,
  RANGE_CONFIRM,
  RANGE_INVERT,
  RANGE_EXPANSION,
  POINT_CLARIFICATION,
}

export type QuestionData = {
  questionType: QuestionType;
  suspectedColor?: string;
  colorValue: number;
  questionStringPre?: string;
  questionStringPost?: string;
};
