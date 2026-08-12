"use client";

import { FormEvent, useEffect, useState } from "react";
import { BrowserRouter, Link, StaticRouter, useNavigate, useParams, useRoutes } from "react-router-dom";
import { addCreator, deleteCreator, getCreator, getCreators, updateCreator, type Creator } from "../src/creatorService";

const emptyForm = { name: "", url: "", description: "", imageUrl: "", category: "" };

function Arrow({ direction = "right" }: { direction?: "right" | "left" }) {
  return <span aria-hidden="true">{direction === "right" ? "↗" : "←"}</span>;
}

function Header() {
  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Creatorverse home">
        <span className="brand-mark">C/V</span>
        <span>Creatorverse</span>
      </Link>
      <Link className="header-cta" to="/add">
        <span>Add a creator</span><span aria-hidden="true">＋</span>
      </Link>
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
      <Link className="primary-button" to="/">Back to the directory</Link>
    </main>
  );
}

function CreatorList() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCreators()
      .then(setCreators)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} />;

  return (
    <main>
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR INTERNET, INTENTIONALLY</p>
          <h1>Curate your corner<br/><em>of the internet.</em></h1>
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
              <Link className="card-image" to={`/creator/${creator.id}`} aria-label={`View ${creator.name}`}>
                <img src={creator.imageUrl} alt="" />
                <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="card-arrow"><Arrow /></span>
              </Link>
              <div className="card-copy">
                <p className="tag">{creator.category || "Creator"}</p>
                <h3><Link to={`/creator/${creator.id}`}>{creator.name}</Link></h3>
                <p>{creator.description}</p>
                <a className="text-link" href={creator.url} target="_blank" rel="noreferrer">
                  Visit channel <Arrow />
                </a>
              </div>
            </article>
          ))}
        </div>
        {creators.length === 0 && (
          <div className="empty-directory">
            <p className="eyebrow">NO CREATORS YET</p>
            <h3>Start your universe.</h3>
            <p>Add the first creator you think deserves more attention.</p>
            <Link className="channel-button" to="/add">Add a creator <Arrow /></Link>
          </div>
        )}
      </section>

      <section className="add-banner">
        <p className="eyebrow">KNOW SOMEONE BRILLIANT?</p>
        <h2>Grow the universe.</h2>
        <Link className="circle-button" to="/add" aria-label="Add a creator"><span>＋</span></Link>
      </section>
    </main>
  );
}

function CreatorDetail({ id }: { id: string }) {
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    getCreator(id)
      .then(setCreator)
      .catch((err: Error) => setError(err.message));
  }, [id]);

  async function removeCreator() {
    setDeleting(true);
    try {
      await deleteCreator(id);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete creator");
      setDeleting(false);
    }
  }

  if (error) return <ErrorState message={error} />;
  if (!creator) return <Loading />;

  return (
    <main className="detail-page">
      <Link className="back-link" to="/"><Arrow direction="left" /> All creators</Link>
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
            <Link to={`/creator/${creator.id}/edit`}>Edit profile</Link>
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
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode === "edit" && id) {
      getCreator(id)
        .then((creator) => setForm({
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
      const creator = mode === "add" ? await addCreator(form) : await updateCreator(id!, form);
      navigate(`/creator/${creator.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save creator");
      setSaving(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <main className="form-page">
      <Link className="back-link" to={mode === "edit" ? `/creator/${id}` : "/"}><Arrow direction="left" /> Cancel</Link>
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

function DetailRoute() {
  const { id } = useParams();
  return id ? <CreatorDetail id={id} /> : <ErrorState message="Creator not found" />;
}

function EditRoute() {
  const { id } = useParams();
  return id ? <CreatorForm mode="edit" id={id} /> : <ErrorState message="Creator not found" />;
}

function CreatorRoutes() {
  return useRoutes([
    { path: "/", element: <CreatorList /> },
    { path: "/add", element: <CreatorForm mode="add" /> },
    { path: "/creator/:id", element: <DetailRoute /> },
    { path: "/creator/:id/edit", element: <EditRoute /> },
    { path: "*", element: <ErrorState message="That page does not exist." /> },
  ]);
}

function CreatorShell() {
  return (
    <div className="app-shell">
      <Header />
      <CreatorRoutes />
      <footer><span>CREATORVERSE © 2026</span><span>Curate your internet.</span></footer>
    </div>
  );
}

export function CreatorApp({ initialPath }: { initialPath: string }) {
  if (typeof window === "undefined") {
    return <StaticRouter location={initialPath}><CreatorShell /></StaticRouter>;
  }
  return <BrowserRouter><CreatorShell /></BrowserRouter>;
}
