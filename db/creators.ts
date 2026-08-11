import { env } from "cloudflare:workers";

const defaultImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85";

const seedCreators = [
  ["Marques Brownlee", "https://www.youtube.com/@mkbhd", "Crisp, considered tech reviews that make complicated products feel immediately understandable.", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85", "Technology"],
  ["Simone Giertz", "https://www.youtube.com/@simonegiertz", "Joyfully strange engineering projects, honest experiments, and machines you never knew you needed.", "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1600&q=85", "Making"],
  ["Jazza", "https://www.youtube.com/@Jazza", "Big-hearted art challenges and practical creative lessons for anyone who wants to make more things.", "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1600&q=85", "Art"],
  ["Kurzgesagt", "https://www.youtube.com/@kurzgesagt", "Vivid animated explainers that turn science, philosophy, and the future into irresistible stories.", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85", "Science"],
  ["LockPickingLawyer", "https://www.youtube.com/@lockpickinglawyer", "Fast, fascinating lock breakdowns that reveal how everyday security works—and where it fails.", "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=85", "Security"],
];

export async function getCreatorDb() {
  const db = env.DB;
  if (!db) throw new Error("Creator database is unavailable");
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS creators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Creator',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS idx_creators_url ON creators(url)"),
  ]);
  const count = await db.prepare("SELECT COUNT(*) AS total FROM creators").first<{ total: number }>();
  if (!count?.total) {
    await db.batch(seedCreators.map((creator) => db.prepare(
      "INSERT OR IGNORE INTO creators (name, url, description, image_url, category) VALUES (?, ?, ?, ?, ?)"
    ).bind(...creator)));
  }
  return db;
}

export function validateCreator(payload: Record<string, unknown>) {
  const name = String(payload.name ?? "").trim();
  const url = String(payload.url ?? "").trim();
  const description = String(payload.description ?? "").trim();
  const imageUrl = String(payload.imageUrl ?? "").trim() || defaultImage;
  const category = String(payload.category ?? "").trim() || "Creator";
  if (!name || !url || !description) throw new Error("Name, channel URL, and description are required.");
  if (description.length > 320) throw new Error("Description must be 320 characters or fewer.");
  for (const [label, value] of [["Channel URL", url], ["Image URL", imageUrl]]) {
    try {
      const parsed = new URL(value);
      if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    } catch {
      throw new Error(`${label} must be a valid web address.`);
    }
  }
  return { name, url, description, imageUrl, category };
}

export const creatorSelect = `SELECT id, name, url, description, image_url AS imageUrl,
  category, created_at AS createdAt FROM creators`;
