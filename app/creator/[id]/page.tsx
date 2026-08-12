import { CreatorApp } from "../../CreatorApp";

export default async function CreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreatorApp initialPath={`/creator/${id}`} />;
}
