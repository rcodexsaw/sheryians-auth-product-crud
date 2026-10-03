import React, { useEffect, useState } from "react";
import { api } from "../api";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const load = async () => {
    try {
      const d = await api.products();
      setProducts(d.products);
    } catch (e) {
      setError(e.message);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const save = async (p) => {
    if (editing) await api.updateProduct(editing._id, p);
    else await api.createProduct(p);
    setEditing(null);
    await load();
  };
  const del = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api.deleteProduct(id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <main className="dashboard">
      <div className="hero">
        <div>
          <div className="eyebrow">PRODUCT MANAGEMENT</div>
          <h1>Simple store dashboard</h1>
        </div>
      </div>
      {error && <div className="error banner">{error}</div>}
      <div className="dashboard-grid">
        <ProductForm
          editing={editing}
          onSave={save}
          onCancel={() => setEditing(null)}
        />
        <section>
          <div className="section-head">
            <h2>Products</h2>
            <span>{products.length} total</span>
          </div>
          {products.length ? (
            <div className="products">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  onEdit={setEditing}
                  onDelete={del}
                />
              ))}
            </div>
          ) : (
            <div className="empty">
              No products yet. Add your first product.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
