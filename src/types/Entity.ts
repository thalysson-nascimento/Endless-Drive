export const Entity = {
  id: "",
  type: "",
} as const;

export type Entity = (typeof Entity)[keyof typeof Entity];
