export const TypeFilter = {
  ALL: "all",
  SURGEY: "surgery",
  CONSULTATION: "consultant",
  APPOINTMENT: "appointment"
} as const;

export type TypeFilter = typeof TypeFilter[keyof typeof TypeFilter];