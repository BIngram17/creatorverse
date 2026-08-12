import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the Creatorverse experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /Creatorverse — Creators worth your attention/);
  assert.match(html, /Curate your corner/);
  assert.match(html, /of the internet/);
  assert.match(html, /Add a creator/);
  assert.doesNotMatch(html, /react-loading-skeleton|Your site is taking shape/i);
});

test("uses Supabase for asynchronous creator CRUD", async () => {
  const [client, service, app, packageJson, hosting] = await Promise.all([
    readFile(new URL("../src/client.js", import.meta.url), "utf8"),
    readFile(new URL("../src/creatorService.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/CreatorApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(client, /createClient/);
  assert.match(client, /NEXT_PUBLIC_SUPABASE_URL/);
  assert.match(client, /NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  assert.match(service, /await supabase\.from\("creators"\)\.select/);
  assert.match(service, /\.insert\(/);
  assert.match(service, /\.update\(/);
  assert.match(service, /\.delete\(\)/);
  assert.match(app, /getCreators\(\)/);
  assert.match(packageJson, /@supabase\/supabase-js/);
  assert.match(hosting, /"d1": null/);
});

test("provides unique creator, edit, and add routes", async () => {
  const [detail, edit, add, app] = await Promise.all([
    readFile(new URL("../app/creator/[id]/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/creator/[id]/edit/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/add/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/CreatorApp.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(detail, /initialPath=\{`\/creator\/\$\{id\}`\}/);
  assert.match(edit, /initialPath=\{`\/creator\/\$\{id\}\/edit`\}/);
  assert.match(add, /initialPath="\/add"/);
  assert.match(app, /useRoutes\(/);
  assert.match(app, /BrowserRouter/);
  assert.match(app, /\/creator\/:id\/edit/);
  assert.match(app, /NO CREATORS YET/);
});
