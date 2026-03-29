export const DateFilter = {
  today: "today",
  week: "week",
  month: "month",
  alldays: "alldays",
} as const;

export type DateFilter = typeof DateFilter[keyof typeof DateFilter];