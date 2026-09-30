import { z } from "zod";

const count = (msg: string) => z.string().trim().regex(/^\d+$/, msg);

// Shared by the form (client) and the API (server). Numbers are kept as text in the
// form and converted to numbers before saving.
export const userSchema = z.object({
  name: z.string().trim().min(2, "Enter the name"),
  officialEmail: z.string().trim().email("Enter a valid official mail ID"),
  date: z.string().min(1, "Select the date"),
  stepCount: count("Enter the step count as a whole number"),
  activity: z.enum(["Done", "Not done"], { errorMap: () => ({ message: "Select Done or Not done" }) }),
  activityCount: count("Enter the activity count as a whole number"),
  additionalActivity: z.string().trim().optional(),
  additionalCount: z.string().trim().regex(/^\d*$/, "Enter the count as a whole number").optional(),
});

export type UserInput = z.infer<typeof userSchema>;

export const fields: { key: keyof UserInput; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "officialEmail", label: "Official mail ID" },
  { key: "date", label: "Date" },
  { key: "stepCount", label: "Step count" },
  { key: "activity", label: "Activity" },
  { key: "activityCount", label: "Activity count" },
  { key: "additionalActivity", label: "Additional activity" },
  { key: "additionalCount", label: "Count" },
];


// Form text -> database row (snake_case columns)
export function toRow(d: UserInput) {
  return {
    name: d.name,
    official_email: d.officialEmail.toLowerCase(),
    date: d.date,
    step_count: Number(d.stepCount),
    activity: d.activity,
    activity_count: Number(d.activityCount),
    additional_activity: d.additionalActivity || "",
    additional_count: d.additionalCount ? Number(d.additionalCount) : null,
  };
}

// Database row -> camelCase object used by the pages and the Excel export
export function fromRow(r: any) {
  return {
    id: r.id,
    name: r.name,
    officialEmail: r.official_email,
    date: r.date,
    stepCount: r.step_count,
    activity: r.activity,
    activityCount: r.activity_count,
    additionalActivity: r.additional_activity,
    additionalCount: r.additional_count,
    createdAt: r.created_at,
  };
}

// Build the search filter for Supabase (strips characters that break the filter syntax)
export function searchFilter(q: string) {
  const t = q.replace(/[,()%*\\]/g, " ").trim();
  return t ? `name.ilike.%${t}%,official_email.ilike.%${t}%,additional_activity.ilike.%${t}%` : "";
}
