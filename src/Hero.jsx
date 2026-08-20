import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "./Hero.css";

const API_BASE = "https://justzbeverages.onrender.com";

// Your Hero entity currently stores { id, name, image }. This form uses that
// field for the hero's video/image URL. If you want a dedicated "video" field
// distinct from a thumbnail, add one on the backend and swap it in below.

function isVideoUrl(url = "") {
  return /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);
}

export function Hero() {
  const [heroes, setHeroes] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const [showAddForm, setShowAddForm] = useState(false);
  const [newHero, setNewHero] = useState({ name: "", image: "" });
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({ name: "", image: "" });
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchHeroes = useCallback(async () => {
    try {
      setStatus("loading");
      const response = await axios.get(`${API_BASE}/api/hero`);
      setHeroes(response.data);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newHero.name.trim() || !newHero.image.trim()) return;

    try {
      setAdding(true);
      const response = await axios.post(`${API_BASE}/api/hero`, newHero);
      setHeroes((list) => [...list, response.data]);
      setNewHero({ name: "", image: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      alert("Could not add the hero entry. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this hero entry? This can't be undone.")) return;

    const prev = heroes;
    setDeletingId(id);
    setHeroes((list) => list.filter((h) => h.id !== id));

    try {
      await axios.delete(`${API_BASE}/api/hero/${id}`);
    } catch (err) {
      console.error(err);
      setHeroes(prev);
      alert("Could not delete this hero entry. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(hero) {
    setEditingId(hero.id);
    setEditDraft({ name: hero.name || "", image: hero.image || "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ name: "", image: "" });
  }

  async function saveEdit(id) {
    try {
      setSaving(true);
      const updated = { id, ...editDraft };
      const response = await axios.put(`${API_BASE}/api/hero/${id}`, updated);
      setHeroes((list) => list.map((h) => (h.id === id ? response.data : h)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      alert("Could not save the changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="hero-admin">
      <div className="hero-admin-head">
        <h1>Hero</h1>
        <button className="hero-add-toggle" onClick={() => setShowAddForm((s) => !s)}>
          {showAddForm ? "Cancel" : "+ Add hero"}
        </button>
      </div>

      {showAddForm && (
        <form className="hero-form" onSubmit={handleAdd}>
          <label>
            Name
            <input
              value={newHero.name}
              onChange={(e) => setNewHero({ ...newHero, name: e.target.value })}
              required
            />
          </label>
          <label>
            Video or image URL
            <input
              value={newHero.image}
              onChange={(e) => setNewHero({ ...newHero, image: e.target.value })}
              placeholder="https://..."
              required
            />
          </label>
          <button type="submit" className="hero-save" disabled={adding}>
            {adding ? "Adding..." : "Add hero"}
          </button>
        </form>
      )}

      {status === "loading" && <p className="hero-msg">Loading...</p>}
      {status === "error" && <p className="hero-msg">Could not load hero entries.</p>}
      {status === "ready" && heroes.length === 0 && (
        <p className="hero-msg">No hero entries yet.</p>
      )}

      {status === "ready" && heroes.length > 0 && (
        <div className="hero-list">
          {heroes.map((h) => (
            <div className="hero-card" key={h.id}>
              <div className="hero-preview">
                {isVideoUrl(h.image) ? (
                  <video src={h.image} muted loop autoPlay playsInline />
                ) : (
                  h.image && <img src={h.image} alt={h.name} />
                )}
              </div>

              {editingId === h.id ? (
                <div className="hero-edit">
                  <input
                    value={editDraft.name}
                    onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                    placeholder="Name"
                  />
                  <input
                    value={editDraft.image}
                    onChange={(e) => setEditDraft({ ...editDraft, image: e.target.value })}
                    placeholder="Video or image URL"
                  />
                  <div className="hero-edit-actions">
                    <button className="hero-save" onClick={() => saveEdit(h.id)} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="hero-cancel" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="hero-name">{h.name}</h3>
                  <p className="hero-url">{h.image}</p>
                  <div className="hero-actions">
                    <button className="hero-edit-btn" onClick={() => startEdit(h)}>
                      Change video
                    </button>
                    <button
                      className="hero-delete"
                      onClick={() => handleDelete(h.id)}
                      disabled={deletingId === h.id}
                    >
                      {deletingId === h.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}