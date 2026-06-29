import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

export function typedZodResolver<T extends FieldValues>(schema: ZodType): Resolver<T> {
  const resolver = zodResolver as unknown as (schema: ZodType) => Resolver<T>;
  return resolver(schema);
}
