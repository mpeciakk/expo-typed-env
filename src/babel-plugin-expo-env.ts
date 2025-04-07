import { dirname, resolve } from "path";
import type * as BabelCoreNamespace from "@babel/core";
import type { NodePath, Visitor } from "@babel/traverse";
import * as t from "@babel/types";
import type * as BabelTypesNamespace from "@babel/types";
import { load } from "@expo/env";
import type * as z from "zod";
import { register } from "ts-node";

import { getMatchPath, normalizeModulePath } from "./util";

export type Babel = typeof BabelCoreNamespace;
export type BabelTypes = typeof BabelTypesNamespace;

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
register();

type PluginOptions = {
  envSchemaPath?: string;
  tsconfigPath?: string;
};

type PluginState = {
  myEnvNames?: string[];
  filename?: string;
  opts: PluginOptions;
};

type EnvExport = {
  default: {
    schema: z.ZodSchema;
  };
};

function parseEnv(schemaModulePath: string) {
  const env = load(resolve("."));
  const envExport = require(schemaModulePath) as EnvExport;
  const validatedEnv = envExport.default.schema.safeParse(env);

  if (!validatedEnv.success) {
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(
        validatedEnv.error.issues,
        null,
        2,
      )}`,
    );
  }

  return validatedEnv.data;
}

export default function plugin() {
  let parsedEnv: any;

  return {
    name: "inline-env-with-proper-value",
    visitor: {
      ImportDeclaration(
        path: NodePath<t.ImportDeclaration>,
        state: PluginState,
      ) {
        if (!state.filename) return;

        const envSchemaPath = state.opts.envSchemaPath || "./env.ts";
        const tsconfigPath = state.opts.tsconfigPath || "./tsconfig.json";

        const importSource = path.node.source.value;
        const schemaModulePath = resolve(process.cwd(), envSchemaPath);
        const normalizedSchemaModulePath = normalizeModulePath(schemaModulePath);

        const matchPath = getMatchPath(tsconfigPath);
        const resolvedImportPath = importSource.startsWith("@/")
          ? matchPath(importSource)
          : resolve(dirname(state.filename), importSource);

        if (!resolvedImportPath) return;
        const normalizedImportedPath = normalizeModulePath(resolvedImportPath);

        if (normalizedImportedPath === normalizedSchemaModulePath) {
          const defaultSpecifier = path.node.specifiers.find((spec) =>
            t.isImportDefaultSpecifier(spec),
          );

          if (defaultSpecifier) {
            parsedEnv = parseEnv(schemaModulePath);

            state.myEnvNames = state.myEnvNames || [];
            state.myEnvNames.push(defaultSpecifier.local.name);
          }

          path.remove();
        }
      },
      MemberExpression(path: NodePath<t.MemberExpression>, state: PluginState) {
        const node = path.node;
        const envs = state.myEnvNames || [];

        if (t.isIdentifier(node.object) && t.isIdentifier(node.property) && envs.includes(node.object.name)) {
          path.replaceWith(
            t.valueToNode(parsedEnv[node.property.name]),
          );
        }
      },
      Identifier(path: NodePath<t.Identifier>, state: PluginState) {
        const envs = state.myEnvNames || [];

        if (envs.includes(path.node.name)) {
          path.replaceWith(t.valueToNode(parsedEnv[path.node.name]));
        }
      },
    } as Visitor<PluginState>,
  };
}
