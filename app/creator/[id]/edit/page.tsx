import { CreatorApp } from "../../../CreatorApp";

export default async function EditCreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreatorApp initialPath={`/creator/${id}/edit`} />;
}
