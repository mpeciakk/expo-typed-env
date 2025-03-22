import fs from "fs";
import path from "path";
import { createMatchPath } from "tsconfig-paths";

export function getMatchPath(tsconfigPath: string) {
  const configPath = path.resolve(process.cwd(), tsconfigPath);
  const tsconfig = JSON.parse(fs.readFileSync(configPath, "utf-8")) as {
    compilerOptions?: {
      baseUrl?: string;
      paths?: Record<string, string[]>;
    };
  };

  const baseUrl = tsconfig.compilerOptions?.baseUrl
    ? path.resolve(process.cwd(), tsconfig.compilerOptions.baseUrl)
    : process.cwd();

  const paths = tsconfig.compilerOptions?.paths || {};

  return createMatchPath(baseUrl, paths);
}

export function normalizeModulePath(filePath: string): string {
  return filePath.replace(/\.(ts|tsx|js|jsx)$/, "");
}
