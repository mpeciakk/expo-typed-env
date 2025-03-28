import { createEnv } from "expo-typed-env";
import { z } from "zod";

const env = createEnv(
  z.object({
    EXPO_PUBLIC_API_URL: z.string(),
  }),
);

export default env;
