import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default async function SemesterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Semester detail"
      description={`Course management for semester ${id}. Add courses, then upload syllabuses.`}
      backHref="/semesters"
      backLabel="Back to semesters"
    />
  );
}
