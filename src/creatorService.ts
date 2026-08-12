import { supabase } from "./client";

export type Creator = {
  id: number;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

export type CreatorInput = Omit<Creator, "id" | "createdAt">;

type CreatorRow = {
  id: number;
  name: string;
  url: string;
  description: string;
  imageURL: string | null;
  category: string;
  created_at: string;
};

const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85";

function fromRow(row: CreatorRow): Creator {
  return {
    id: row.id,
    name: row.name,
    url: row.url,
    description: row.description,
    imageUrl: row.imageURL || defaultImage,
    category: row.category || "Creator",
    createdAt: row.created_at,
  };
}

function toRow(creator: CreatorInput) {
  return {
    name: creator.name.trim(),
    url: creator.url.trim(),
    description: creator.description.trim(),
    imageURL: creator.imageUrl.trim() || defaultImage,
    category: creator.category.trim() || "Creator",
  };
}

function validate(creator: CreatorInput) {
  if (!creator.name.trim() || !creator.url.trim() || !creator.description.trim()) {
    throw new Error("Name, channel URL, and description are required.");
  }
  if (creator.description.trim().length > 320) {
    throw new Error("Description must be 320 characters or fewer.");
  }
}

export async function getCreators(): Promise<Creator[]> {
  const { data, error } = await supabase.from("creators").select("*").order("id", { ascending: true });
  if (error) throw error;
  return (data as CreatorRow[]).map(fromRow);
}

export async function getCreator(id: string): Promise<Creator> {
  const { data, error } = await supabase.from("creators").select("*").eq("id", id).single();
  if (error) throw error;
  return fromRow(data as CreatorRow);
}

export async function addCreator(creator: CreatorInput): Promise<Creator> {
  validate(creator);
  const { data, error } = await supabase.from("creators").insert(toRow(creator)).select().single();
  if (error) throw error;
  return fromRow(data as CreatorRow);
}

export async function updateCreator(id: string, creator: CreatorInput): Promise<Creator> {
  validate(creator);
  const { data, error } = await supabase.from("creators").update(toRow(creator)).eq("id", id).select().single();
  if (error) throw error;
  return fromRow(data as CreatorRow);
}

export async function deleteCreator(id: string): Promise<void> {
  const { error } = await supabase.from("creators").delete().eq("id", id);
  if (error) throw error;
}
