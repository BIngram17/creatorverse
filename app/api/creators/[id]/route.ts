import { creatorSelect, getCreatorDb, validateCreator } from "../../../../db/creators";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const db = await getCreatorDb();
    const creator = await db.prepare(`${creatorSelect} WHERE id = ?`).bind(id).first();
    if (!creator) return Response.json({ error: "Creator not found" }, { status: 404 });
    return Response.json({ creator });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not load creator" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const creator = validateCreator(await request.json() as Record<string, unknown>);
    const db = await getCreatorDb();
    const updated = await db.prepare(
      "UPDATE creators SET name = ?, url = ?, description = ?, image_url = ?, category = ? WHERE id = ? RETURNING id"
    ).bind(creator.name, creator.url, creator.description, creator.imageUrl, creator.category, id).first();
    if (!updated) return Response.json({ error: "Creator not found" }, { status: 404 });
    const saved = await db.prepare(`${creatorSelect} WHERE id = ?`).bind(id).first();
    return Response.json({ creator: saved });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not update creator";
    const duplicate = message.includes("UNIQUE");
    return Response.json({ error: duplicate ? "That channel is already in Creatorverse." : message }, { status: duplicate ? 409 : 400 });
  }
}

export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    const db = await getCreatorDb();
    const deleted = await db.prepare("DELETE FROM creators WHERE id = ? RETURNING id").bind(id).first();
    if (!deleted) return Response.json({ error: "Creator not found" }, { status: 404 });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Could not delete creator" }, { status: 500 });
  }
}
