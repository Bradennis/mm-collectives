import React, { useEffect, useState } from "react";
import api from "../api/client";

const emptyForm = {
  name: "", slug: "", description: "", brand: "", priceGHS: "", salePriceGHS: "", costPriceGHS: "", stock: "",
  unitWeightKg: "", category: "", imagesText: "", isFeatured: false, isNewArrival: false, isBestseller: false,
  minGroupBuyQty: "", groupBuyDiscountPct: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => api.get("/products", { params: { limit: 100 } }).then((res) => setProducts(res.data.products));
  const loadCategories = () => api.get("/categories").then((res) => setCategories(res.data));

  useEffect(() => { loadProducts(); loadCategories(); }, []);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { imagesText, ...fields } = form;
    const payload = {
      ...fields,
      images: imagesText.split("\n").map((url) => url.trim()).filter(Boolean),
      priceGHS: Number(form.priceGHS),
      salePriceGHS: Number(form.salePriceGHS) || 0,
      costPriceGHS: Number(form.costPriceGHS) || 0,
      stock: Number(form.stock) || 0,
      unitWeightKg: Number(form.unitWeightKg) || 0,
      minGroupBuyQty: Number(form.minGroupBuyQty) || 0,
      groupBuyDiscountPct: Number(form.groupBuyDiscountPct) || 0,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post("/products", payload);
    }
    resetForm();
    loadProducts();
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description, brand: p.brand || "", priceGHS: p.priceGHS,
      salePriceGHS: p.salePriceGHS || "", imagesText: (p.images || []).join("\n"),
      isNewArrival: !!p.isNewArrival, isBestseller: !!p.isBestseller,
      costPriceGHS: p.costPriceGHS, stock: p.stock, unitWeightKg: p.unitWeightKg,
      category: p.category?._id || p.category, isFeatured: p.isFeatured,
      minGroupBuyQty: p.minGroupBuyQty, groupBuyDiscountPct: p.groupBuyDiscountPct,
    });
    setEditingId(p._id);
    setShowForm(true);
  };

  const handleDeactivate = async (id) => {
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h1>Products</h1>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Product</button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card" style={{ marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ gridColumn: "1 / -1", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} rows={2} />
          <input type="number" placeholder="Selling Price (GH₵)" required value={form.priceGHS} onChange={(e) => setForm({ ...form, priceGHS: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" placeholder="Sale Price (GH₵, blank = not on sale)" value={form.salePriceGHS} onChange={(e) => setForm({ ...form, salePriceGHS: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input placeholder="Brand (optional)" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" placeholder="Cost Price (GH₵, internal)" value={form.costPriceGHS} onChange={(e) => setForm({ ...form, costPriceGHS: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" step="0.01" placeholder="Unit Weight (kg)" value={form.unitWeightKg} onChange={(e) => setForm({ ...form, unitWeightKg: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" placeholder="Min Group-Buy Qty (0 = none)" value={form.minGroupBuyQty} onChange={(e) => setForm({ ...form, minGroupBuyQty: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <input type="number" placeholder="Group-Buy Discount %" value={form.groupBuyDiscountPct} onChange={(e) => setForm({ ...form, groupBuyDiscountPct: e.target.value })} style={{ padding: 10, borderRadius: 6, border: "1px solid #ddd" }} />
          <textarea placeholder="Image URLs (one per line)" value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} style={{ gridColumn: "1 / -1", padding: 10, borderRadius: 6, border: "1px solid #ddd" }} rows={2} />
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured on homepage
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={form.isNewArrival} onChange={(e) => setForm({ ...form, isNewArrival: e.target.checked })} /> New arrival
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={form.isBestseller} onChange={(e) => setForm({ ...form, isBestseller: e.target.checked })} /> Bestseller ("HOT" badge)
          </label>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 10 }}>
            <button className="btn-primary" type="submit">{editingId ? "Update" : "Create"} Product</button>
            <button type="button" onClick={resetForm} style={{ padding: "9px 18px", borderRadius: 8, border: "1px solid #ddd", background: "#fff" }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="card">
        <table>
          <thead>
            <tr><th>Name</th><th>Category</th><th>Price</th><th>Margin</th><th>Stock</th><th>Sold</th><th></th></tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name} {p.isFeatured && <span className="status-pill" style={{ marginLeft: 6 }}>Featured</span>}</td>
                <td>{p.category?.name}</td>
                <td>GH₵ {p.priceGHS}{p.salePriceGHS > 0 && p.salePriceGHS < p.priceGHS && <span className="status-pill" style={{ marginLeft: 6 }}>Sale GH₵ {p.salePriceGHS}</span>}</td>
                <td>GH₵ {(p.priceGHS - (p.costPriceGHS || 0)).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.soldCount}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => handleEdit(p)} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDeactivate(p._id)} style={{ background: "none", border: "none", color: "var(--color-danger)", cursor: "pointer" }}>Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
