import { formatISO, isValid, parseISO } from "date-fns";

/** Normalize a parseable ISO string to UTC ISO, or return null when invalid/unknown. */
export function toUtcIsoOrNull(value: string | null | undefined): string | null {
  if (!value) return null;
  const parsed = parseISO(value);
  if (!isValid(parsed)) return null;
  return formatISO(parsed);
}

/** Spec rule: never invent a year/time for ambiguous syllabus language. */
export function leaveAmbiguousDateUnknown(): null {
  return null;
}
