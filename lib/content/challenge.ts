import day00 from "@/content/challenge/day-00";
import { ChallengeEntrySchema, type ChallengeEntry } from "@/lib/content/schemas";

const rawEntries = [day00] satisfies ChallengeEntry[];

export const challengeEntries = rawEntries
  .map((entry) => ChallengeEntrySchema.parse(entry))
  .sort((a, b) => b.day - a.day);
