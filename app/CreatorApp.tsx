"use client";

import { FormEvent, useEffect, useState } from "react";

export type Creator = {
  id: number;
  name: string;
  url: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
};

type Mode = "list" | "detail" | "add" | "edit";

const emptyForm = { name: "", url: "", description: "", imageUrl: "", category: "" };

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

function Arrow({ direction = "right" }: { direction?: "right" | "left" }) {
  return <span aria-hidden="true">{direction === "right" ? "↗" : "←"}</span>;
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Creatorverse home">
        <span className="brand-mark">C/V</span>
        <span>Creatorverse</span>
      </a>
      <a className="header-cta" href="/add">
        <span>Add a creator</span><span aria-hidden="true">＋</span>
      </a>
    </header>
  );
}

function Loading() {
  return <main className="status-page"><div className="loader" /><p>Tuning the signal…</p></main>;
}

function ErrorState({ message }: { message: string }) {
  return (
    <main className="status-page">
      <p className="eyebrow">SIGNAL LOST</p>
      <h1>We couldn’t load this page.</h1>
      <p>{message}</p>
      <a className="primary-button" href="/">Back to the directory</a>
    </main>
  );
}

function CreatorList() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<{ creators: Creator[] }>("/api/creators")
      .then((data) => setCreators(data.creators))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR NEXT FAVORITE FOLLOW</p>
          <h1>Good internet.<br/><em>Found here.</em></h1>
        </div>
        <div className="hero-note">
          <span className="orbit-dot" />
          <p>A hand-picked field guide to people making the web more curious, useful, and alive.</p>
          <a href="#directory">Browse the directory <span aria-hidden="true">↓</span></a>
        </div>
      </section>

      <section className="directory" id="directory">
        <div className="section-heading">
          <div><p className="eyebrow">THE DIRECTORY</p><h2>Worth your attention</h2></div>
          <p className="count"><strong>{String(creators.length).padStart(2, "0")}</strong> voices in orbit</p>
        </div>

        <div className="creator-grid">
          {creators.map((creator, index) => (
            <article className="creator-card" key={creator.id}>
              <a className="card-image" href={`/creator/${creator.id}`} aria-label={`View ${creator.name}`}>
                <img src={creator.imageUrl} alt="" />
                <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="card-arrow"><Arrow /></span>
              </a>
              <div className="card-copy">
                <p className="tag">{creator.category || "Creator"}</p>
                <h3><a href={`/creator/${creator.id}`}>{creator.name}</a></h3>
                <p>{creator.description}</p>
                <a className="text-link" href={creator.url} target="_blank" rel="noreferrer">
                  Visit channel <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="add-banner">
        <p className="eyebrow">KNOW SOMEONE BRILLIANT?</p>
        <h2>Grow the universe.</h2>
        <a className="circle-button" href="/add" aria-label="Add a creator"><span>＋</span></a>
      </section>
    </main>
  );
}

function CreatorDetail({ id }: { id: string }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api<{ creator: Creator }>(`/api/creators/${id}`)
      .then((data) => setCreator(data.creator))
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function removeCreator() {
    setDeleting(true);
    try {
      await api(`/api/creators/${id}`, { method: "DELETE" });
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete creator");
      setDeleting(false);
    }
  }

  if (error) return <ErrorState message={error} />;
  if (!creator) return <Loading />;

  return (
    <main className="detail-page">
      <a className="back-link" href="/"><Arrow direction="left" /> All creators</a>
      <section className="detail-layout">
        <div className="detail-image">
          <img src={creator.imageUrl} alt={`${creator.name} featured content`} />
          <span className="vertical-label">CREATOR PROFILE / {String(creator.id).padStart(2, "0")}</span>
        </div>
        <div className="detail-copy">
          <p className="tag">{creator.category || "Creator"}</p>
          <h1>{creator.name}</h1>
          <p className="detail-description">{creator.description}</p>
          <a className="channel-button" href={creator.url} target="_blank" rel="noreferrer">
            Visit their channel <Arrow />
          </a>
          <div className="detail-actions">
            <a href={`/creator/${creator.id}/edit`}>Edit profile</a>
            <button type="button" onClick={() => setConfirming(true)}>Delete creator</button>
          </div>
        </div>
      </section>

      {confirming && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setConfirming(false)}>
          <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-title" onMouseDown={(e) => e.stopPropagation()}>
            <p className="eyebrow">REMOVE FROM ORBIT</p>
            <h2 id="confirm-title">Delete {creator.name}?</h2>
            <p>This permanently removes the creator from your directory.</p>
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setConfirming(false)}>Keep creator</button>
              <button className="danger-button" type="button" onClick={removeCreator} disabled={deleting}>{deleting ? "Deleting…" : "Yes, delete"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function CreatorForm({ mode, id }: { mode: "add" | "edit"; id?: string }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      api<{ creator: Creator }>(`/api/creators/${id}`)
        .then(({ creator }) => setForm({
          name: creator.name, url: creator.url, description: creator.description,
          imageUrl: creator.imageUrl, category: creator.category,
        }))
        .catch((err: Error) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const endpoint = mode === "add" ? "/api/creators" : `/api/creators/${id}`;
      const data = await api<{ creator: Creator }>(endpoint, {
        method: mode === "add" ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      window.location.href = `/creator/${data.creator.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save creator");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <main className="form-page">
      <a className="back-link" href={mode === "edit" ? `/creator/${id}` : "/"}><Arrow direction="left" /> Cancel</a>
      <div className="form-layout">
        <div className="form-intro">
          <p className="eyebrow">{mode === "add" ? "EXPAND THE UNIVERSE" : "REFINE THE PROFILE"}</p>
          <h1>{mode === "add" ? <>Add a creator<br/><em>worth sharing.</em></> : <>Edit this<br/><em>creator.</em></>}</h1>
          <p>Great recommendations are specific. Tell us what they make—and why someone should care.</p>
        </div>
        <form className="creator-form" onSubmit={submit}>
          <label><span>Name <b>*</b></span><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Simone Giertz" /></label>
          <label><span>Channel URL <b>*</b></span><input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://youtube.com/@creator" /></label>
          <label><span>Short description <b>*</b></span><textarea required rows={5} maxLength={320} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What do they make, and why are they worth following?" /><small>{form.description.length}/320</small></label>
          <div className="field-row">
            <label><span>Category</span><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Design, Science, Tech…" /></label>
            <label><span>Image URL</span><input type="url" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://…" /></label>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="submit-button" type="submit" disabled={saving}>
            <span>{saving ? "Saving…" : mode === "add" ? "Add to Creatorverse" : "Save changes"}</span><Arrow />
          </button>
        </form>
      </div>
    </main>
  );
}

export function CreatorApp({ mode, id }: { mode: Mode; id?: string }) {
  return (
    <div className="app-shell">
      <Header />
      {mode === "list" && <CreatorList />}
      {mode === "detail" && id && <CreatorDetail id={id} />}
      {(mode === "add" || mode === "edit") && <CreatorForm mode={mode} id={id} />}
      <footer><span>CREATORVERSE © 2026</span><span>Curate your internet.</span></footer>
    </div>
  );
}
