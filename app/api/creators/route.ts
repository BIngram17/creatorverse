import { creatorSelect, getCreatorDb, validateCreator } from "../../../db/creators";

export async function GET() {
  try {
    const db = await getCreatorDb();
    const result = await db.prepare(`${creatorSelect} ORDER BY id ASC`).all();
    return Response.json({ creators: result.results });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not load creators" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const creator = validateCreator(await request.json() as Record<string, unknown>);
    const db = await getCreatorDb();
    const result = await db.prepare(
      "INSERT INTO creators (name, url, description, image_url, category) VALUES (?, ?, ?, ?, ?) RETURNING id"
    ).bind(creator.name, creator.url, creator.description, creator.imageUrl, creator.category).first<{ id: number }>();
    const saved = await db.prepare(`${creatorSelect} WHERE id = ?`).bind(result?.id).first();
    return Response.json({ creator: saved }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not add creator";
    const duplicate = message.includes("UNIQUE");
    return Response.json({ error: duplicate ? "That channel is already in Creatorverse." : message }, { status: duplicate ? 409 : 400 });
  }
}
