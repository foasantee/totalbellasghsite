"use client";

import { useActionState } from "react";
import { ImageUploader } from "./ImageUploader";
import type { ProductFormState } from "@/actions/products";
import { CATEGORY_LABELS } from "@/lib/site-config";
import type { Category } from "@prisma/client";

const CATEGORIES: Category[] = ["CLOTHING", "SHOES", "BAGS", "FRAGRANCE"];

type Action = (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;

export function ProductForm({
  action,
  initial,
}: {
  action: Action;
  initial?: {
    name: string;
    description: string;
    price: number | string;
    category: Category;
    quantity: number;
    badge: string | null;
    images: string[];
  };
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});

  return (
    <form action={formAction} className="product-form" noValidate>
      <div className="form-field">
        <label htmlFor="name">Product Name</label>
        <input type="text" id="name" name="name" required defaultValue={initial?.name} />
      </div>

      <div className="form-field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" rows={4} defaultValue={initial?.description} />
      </div>

      <div className="form-field">
        <label htmlFor="price">Price (GHS)</label>
        <input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          required
          defaultValue={initial?.price !== undefined ? String(initial.price) : undefined}
        />
      </div>

      <div className="form-field">
        <label htmlFor="category">Category</label>
        <select id="category" name="category" required defaultValue={initial?.category ?? "CLOTHING"}>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {CATEGORY_LABELS[category]}
            </option>
          ))}
        </select>
      </div>

      <div className="form-field">
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          min="0"
          step="1"
          required
          defaultValue={initial?.quantity ?? 0}
        />
        <p className="form-field__hint">Quantity 0 → shows as &quot;Out of stock&quot; automatically.</p>
      </div>

      <div className="form-field">
        <label htmlFor="badge">Badge (optional)</label>
        <select id="badge" name="badge" defaultValue={initial?.badge ?? ""}>
          <option value="">None</option>
          <option value="New">New</option>
          <option value="Best Seller">Best Seller</option>
        </select>
      </div>

      <div className="form-field">
        <label>Photos</label>
        <ImageUploader initialImages={initial?.images} />
      </div>

      {state.error ? (
        <p className="form-field__error" role="alert">
          {state.error}
        </p>
      ) : null}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "Saving…" : "Save Product"}
      </button>
    </form>
  );
}
