# expo-env

Type-safe environment variables for Expo applications using Zod schemas.

## Features

- 🔒 **Type Safety**: Validate your environment variables at build time using
  Zod schemas
- 📱 **Expo Compatible**: Seamlessly works with Expo applications
- ⚡ **Build-time Validation**: Catch environment variable issues before they
  reach production
- 🔄 **Auto-completion**: Get full TypeScript support and auto-completion for
  your env variables

## Installation

```bash
npm install expo-env
# or
yarn add expo-env
# or
pnpm add expo-env
```

## Usage

1. Create an `env.ts` file in your project:

```typescript
import { createEnv } from "expo-env";
import { z } from "zod";

export const env = createEnv(
  z.object({
    EXPO_PUBLIC_API_URL: z.string().url(),
    EXPO_PUBLIC_API_KEY: z.string().min(1),
  }),
);
```

2. Configure your Babel configuration (in `babel.config.js`):

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      [
        "expo-env/babel-plugin",
        {
          // Optional: Custom path to your env schema file, defaults to "./env.ts"
          envSchemaPath: "./src/env.ts",
          // Optional: Custom path to your tsconfig.json (for TypeScript path aliases), defaults to "./tsconfig.json"
          tsconfigPath: "./tsconfig.json",
        },
      ],
    ],
    // ... other configuration
  };
};
```

3. Use your typed environment variables:

```typescript
// Using default import
import env from "./env";

// Or with TypeScript path aliases if you have them configured
import env from "@/env";

// TypeScript will know the exact type of these variables
console.log(env.EXPO_PUBLIC_API_URL);
console.log(env.EXPO_PUBLIC_API_KEY);
```

## TypeScript Path Aliases

The library fully supports TypeScript path aliases. If you have configured path
aliases in your `tsconfig.json`, you can use them to import your env file:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Then you can import your env file using the alias:

```typescript
import env from "@/env";
```

## Example Project

You can find a complete working example in the `example/` directory of this
repository. It demonstrates:

- Basic setup and configuration
- TypeScript path aliases
- Environment variable validation
- Integration with an Expo project

## How It Works

expo-env uses a combination of build-time validation and Zod schemas to ensure
your environment variables are both present and correctly typed. The Babel
plugin automatically processes your environment variables during the build
process, providing type safety and validation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Made with ❤️ for the Expo community
