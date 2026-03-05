import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export async function readJsonFile<T>(relativePath: string, schema: z.ZodType<T>): Promise<T> {
  const absolutePath = path.join(process.cwd(), relativePath);
  const raw = await readFile(absolutePath, "utf-8");
  return schema.parse(JSON.parse(raw) as unknown);
}

export async function writeJsonFile<T>(relativePath: string, schema: z.ZodType<T>, value: T): Promise<T> {
  const parsed = schema.parse(value);
  const absolutePath = path.join(process.cwd(), relativePath);
  await writeFile(absolutePath, JSON.stringify(parsed, null, 2), "utf-8");
  return parsed;
}
