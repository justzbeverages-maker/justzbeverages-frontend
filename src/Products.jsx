import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getAdminAuthHeader } from "./Auth";
import "./Products.css";

const API_BASE = "https://justzbeverages.onrender.com";

const BLANK_FORM = {
  name: "",
  front_image: "",
  back_image: "",
  nutrition: "",
  des: "",
};

// Fires the same "admin-unauthorized" event AdminPanel listens for, so a
// stale/expired login gets bounced back to the login screen automatically.
function handleAuthError(err) {
  if (err.response && (err.response.status === 401 || err.response.status === 403)) {
    window.dispatchEvent(new Event("admin-unauthorized"));
  }
}

export function Products() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState(BLANK_FORM);
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null); // product currently being edited
  const [editDraft, setEditDraft] = useState({ name: "", des: "" });
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setStatus("loading");
      // GET /api/products is public — no auth header needed here.
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data);
      setStatus("ready");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleAddProduct(e) {
    e.preventDefault();
    if (!newProduct.name.trim()) return;

    try {
      setAdding(true);
      const response = await axios.post(`${API_BASE}/api/products`, newProduct, {
        headers: { Authorization: getAdminAuthHeader() },
      });
      setProducts((list) => [...list, response.data]);
      setNewProduct(BLANK_FORM);
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
      handleAuthError(err);
      alert("Could not add the product. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This can't be undone.")) return;

    const prev = products;
    setDeletingId(id);
    setProducts((list) => list.filter((p) => p.id !== id));

    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: getAdminAuthHeader() },
      });
    } catch (err) {
      console.error(err);
      handleAuthError(err);
      setProducts(prev);
      alert("Could not delete this product. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(product) {
    setEditingId(product.id);
    setEditDraft({ name: product.name || "", des: product.des || "" });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ name: "", des: "" });
  }

  async function saveEdit(id) {
    try {
      setSaving(true);
      const target = products.find((p) => p.id === id);
      const updated = { ...target, name: editDraft.name, des: editDraft.des };
      const response = await axios.put(`${API_BASE}/api/products/${id}`, updated, {
        headers: { Authorization: getAdminAuthHeader() },
      });
      setProducts((list) => list.map((p) => (p.id === id ? response.data : p)));
      cancelEdit();
    } catch (err) {
      console.error(err);
      handleAuthError(err);
      alert("Could not save the changes. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="products">
      <div className="products-head">
        <h1>Products</h1>
        <button className="products-add-toggle" onClick={() => setShowAddForm((s) => !s)}>
          {showAddForm ? "Cancel" : "+ Add product"}
        </button>
      </div>

      {showAddForm && (
        <form className="product-form" onSubmit={handleAddProduct}>
          <div className="product-form-grid">
            <label>
              Name
              <input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
            </label>
            <label>
              Front image URL
              <input
                value={newProduct.front_image}
                onChange={(e) => setNewProduct({ ...newProduct, front_image: e.target.value })}
              />
            </label>
            <label>
              Back image URL
              <input
                value={newProduct.back_image}
                onChange={(e) => setNewProduct({ ...newProduct, back_image: e.target.value })}
              />
            </label>
            <label>
              Nutrition
              <input
                value={newProduct.nutrition}
                onChange={(e) => setNewProduct({ ...newProduct, nutrition: e.target.value })}
              />
            </label>
          </div>
          <label className="product-form-des">
            Description
            <textarea
              rows={3}
              value={newProduct.des}
              onChange={(e) => setNewProduct({ ...newProduct, des: e.target.value })}
            />
          </label>
          <button type="submit" className="product-save" disabled={adding}>
            {adding ? "Adding..." : "Add product"}
          </button>
        </form>
      )}

      {status === "loading" && <p className="products-msg">Loading...</p>}
      {status === "error" && <p className="products-msg">Could not load products.</p>}
      {status === "ready" && products.length === 0 && (
        <p className="products-msg">No products yet.</p>
      )}

      {status === "ready" && products.length > 0 && (
        <div className="products-grid">
          {products.map((p) => (
            <div className="product-card" key={p.id}>
              <div className="product-images">
                {p.front_image && <img src={p.front_image} alt={p.name} />}
                {p.back_image && <img src={p.back_image} alt={`${p.name} back`} />}
              </div>

              {editingId === p.id ? (
                <div className="product-edit">
                  <input
                    className="product-edit-name"
                    value={editDraft.name}
                    onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                    placeholder="Product name"
                  />
                  <textarea
                    className="product-edit-des"
                    rows={3}
                    value={editDraft.des}
                    onChange={(e) => setEditDraft({ ...editDraft, des: e.target.value })}
                    placeholder="Description"
                  />
                  <div className="product-edit-actions">
                    <button
                      className="product-save"
                      onClick={() => saveEdit(p.id)}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                    <button className="product-cancel" onClick={cancelEdit} disabled={saving}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="product-name">{p.name}</h3>
                  {p.nutrition && <p className="product-nutrition">{p.nutrition}</p>}
                  <p className="product-des">{p.des}</p>
                  <div className="product-actions">
                    <button className="product-edit-btn" onClick={() => startEdit(p)}>
                      Edit description
                    </button>
                    <button
                      className="product-delete"
                      onClick={() => handleDelete(p.id)}
                      disabled={deletingId === p.id}
                    >
                      {deletingId === p.id ? "Deleting..." : "Delete"}
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