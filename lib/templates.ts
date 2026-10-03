import { z } from "zod";

export const TYPES = ["text", "textarea", "number", "date", "email", "phone", "select"] as const;
export type FieldDef = { key: string; label: string; type: (typeof TYPES)[number]; required?: boolean; options?: string[] };
export type Template = { id: string; name: string; slug: string; fields: FieldDef[]; is_active: boolean };

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const keyify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").replace(/^(\d)/, "f_$1");

// Builds a validator from a template's field list (used by the form AND the server)
export function buildSchema(fields: FieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    shape[f.key] = z.string().trim().superRefine((v, ctx) => {
      const bad = (message: string) => ctx.addIssue({ code: "custom", message });
      if (!v) return f.required ? bad("This field is required") : undefined;
      if (f.type === "number" && !/^-?\d+(\.\d+)?$/.test(v)) bad("Enter a number");
      if (f.type === "email" && !z.string().email().safeParse(v).success) bad("Enter a valid email");
      if (f.type === "phone" && !/^[0-9+\-\s]{7,15}$/.test(v)) bad("Enter a valid phone number");
      if (f.type === "select" && !f.options?.includes(v)) bad("Choose one of the options");
    }).default("");
  }
  return z.object(shape);
}

// Validates a template definition created by an admin
export const templateDef = z.object({
  name: z.string().trim().min(2, "Enter a template name"),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "URL name: lowercase letters, numbers and dashes only"),
  is_active: z.boolean().default(true),
  fields: z.array(z.object({
    key: z.string().regex(/^[a-z][a-z0-9_]*$/, "Invalid field key"),
    label: z.string().trim().min(1, "Every field needs a label"),
    type: z.enum(TYPES),
    required: z.boolean().optional(),
    options: z.array(z.string()).optional(),
  })).min(1, "Add at least one field")
    .refine((a) => new Set(a.map((f) => f.key)).size === a.length, "Two fields have the same name")
    .refine((a) => a.every((f) => f.type !== "select" || (f.options?.length ?? 0) > 0), "Dropdown fields need options"),
});
