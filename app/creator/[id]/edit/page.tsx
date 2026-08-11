import { CreatorApp } from "../../../CreatorApp";

export default async function EditCreatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CreatorApp mode="edit" id={id} />;
}
