import React from "react";
export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <article className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} />
      ) : (
        <div className="image-placeholder">
          {product.name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <div className="product-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          <span>Stock: {product.stock}</span>
        </div>
        <div className="actions">
          <button onClick={() => onEdit(product)}>Edit</button>
          <button className="danger" onClick={() => onDelete(product._id)}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
