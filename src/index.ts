import type * as z from "zod";

export type Env<T extends z.ZodSchema, S extends z.infer<T>> = {
  [key in keyof S]: S[key];
} & {
  schema: T;
};

export function createEnv<T extends z.ZodSchema, S = z.infer<T>>(schema: T) {
  const env = {} as S;

  return {
    schema,
    ...env,
  };
}
