import { PlaceholderPage } from "@/components/ui/placeholder-page";

export default async function CourseUploadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PlaceholderPage
      title="Upload center"
      description={`Upload PDF, DOCX, PNG, or JPEG syllabuses for course ${id}. Processing states: queued → processing → review needed/completed, or failed.`}
    />
  );
}
