import { mkdirSync, existsSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { generateApi } from "swagger-typescript-api";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.resolve(projectRoot, "clients", "fNAPlatformAPIClient");
const docsDir = path.resolve(projectRoot, "docs");
const cachedSpecPath = path.resolve(docsDir, "openapi.json");

const candidateSpecPaths = [
  "swagger.json",
  "swagger.yaml",
  "swagger.yml",
  "openapi.json",
  "openapi.yaml",
  "openapi.yml",
  path.join("docs", "swagger.json"),
  path.join("docs", "swagger.yaml"),
  path.join("docs", "swagger.yml"),
  path.join("docs", "openapi.json"),
  path.join("docs", "openapi.yaml"),
  path.join("docs", "openapi.yml"),
];

function toProjectRelativePath(filePath) {
  return path.relative(projectRoot, filePath) || ".";
}

function getBackendOrigin() {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "http://localhost:8080";
  }
}

function getSwaggerUrls() {
  const explicitUrl = process.env.SWAGGER_URL;
  const backendOrigin = getBackendOrigin();

  if (explicitUrl) {
    return [explicitUrl];
  }

  return [`${backendOrigin}/v3/api-docs`, `${backendOrigin}/api-docs`];
}

async function tryFetchSwaggerSpec() {
  const authToken = process.env.SWAGGER_AUTH_TOKEN ?? process.env.API_AUTH_TOKEN;
  const headers = authToken
    ? {
        Authorization: `Bearer ${authToken}`,
      }
    : undefined;

  const errors = [];

  for (const swaggerUrl of getSwaggerUrls()) {
    try {
      const response = await fetch(swaggerUrl, { headers });

      if (!response.ok) {
        errors.push(`${swaggerUrl} -> ${response.status} ${response.statusText}`);
        continue;
      }

      const responseText = await response.text();
      const spec = JSON.parse(responseText);

      mkdirSync(docsDir, { recursive: true });
      writeFileSync(cachedSpecPath, `${JSON.stringify(spec, null, 2)}\n`, "utf8");

      return cachedSpecPath;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      errors.push(`${swaggerUrl} -> ${message}`);
    }
  }

  return {
    errors,
  };
}

async function resolveSpecPath() {
  const explicitArg = process.argv[2];
  const explicitEnv = process.env.SWAGGER_FILE;
  const explicitPath = explicitArg ?? explicitEnv;

  if (explicitPath) {
    const resolvedPath = path.isAbsolute(explicitPath)
      ? explicitPath
      : path.resolve(projectRoot, explicitPath);

    if (existsSync(resolvedPath)) {
      return resolvedPath;
    }

    throw new Error(
      `Swagger file not found at "${toProjectRelativePath(resolvedPath)}".`,
    );
  }

  const fetchedSpecPath = await tryFetchSwaggerSpec();

  if (typeof fetchedSpecPath === "string") {
    return fetchedSpecPath;
  }

  for (const candidate of candidateSpecPaths) {
    const resolvedCandidate = path.resolve(projectRoot, candidate);

    if (existsSync(resolvedCandidate)) {
      return resolvedCandidate;
    }
  }

  const formattedCandidates = candidateSpecPaths
    .map((candidate) => `- ${candidate}`)
    .join("\n");
  const fetchErrors = fetchedSpecPath.errors.map((error) => `- ${error}`).join("\n");

  throw new Error(
    `No Swagger/OpenAPI file was found.\n\nTried live endpoints:\n${fetchErrors}\n\nPass a path as "npm run generate:api -- <path-to-spec>" or set SWAGGER_FILE.\n\nChecked:\n${formattedCandidates}`,
  );
}

function writeCompatibilityFiles(specPath) {
  const compatibilityBanner = [
    "/* eslint-disable */",
    "/* tslint:disable */",
    "// @ts-nocheck",
    "// Compatibility re-exports for the existing client import paths.",
    "",
  ].join("\n");

  writeFileSync(
    path.join(outputDir, "models.ts"),
    `${compatibilityBanner}export * from "./apis";\n`,
    "utf8",
  );

  writeFileSync(
    path.join(outputDir, "http-client.ts"),
    `${compatibilityBanner}export * from "./apis";\n`,
    "utf8",
  );

  writeFileSync(
    path.join(outputDir, "index.ts"),
    `${compatibilityBanner}export * from "./apis";\n`,
    "utf8",
  );

  writeFileSync(
    path.join(outputDir, "README.md"),
    `# fNAPlatformAPIClient\n\nGenerated from \`${toProjectRelativePath(specPath)}\`.\n`,
    "utf8",
  );
}

async function main() {
  const specPath = await resolveSpecPath();

  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  await generateApi({
    input: specPath,
    output: outputDir,
    fileName: "apis.ts",
    httpClientType: "axios",
    modular: false,
    generateClient: true,
    generateResponses: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractResponseBody: true,
    cleanOutput: false,
  });

  writeCompatibilityFiles(specPath);

  console.log(
    `Generated API client in "${toProjectRelativePath(outputDir)}" from "${toProjectRelativePath(specPath)}".`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
