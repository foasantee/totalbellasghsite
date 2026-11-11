"use client";

import { useActionState, useState } from "react";
import { ImageUploader } from "./ImageUploader";
import type { ProductFormState } from "@/actions/products";
import { CATEGORY_LABELS, SIZE_LABELS, sizesForCategory } from "@/lib/site-config";
import type { Category, Size } from "@prisma/client";

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
    sizes: { size: Size; quantity: number }[];
  };
}) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(action, {});
  const [category, setCategory] = useState<Category>(initial?.category ?? "CLOTHING");
  const initialSizeQuantities = new Map(
    (initial?.sizes ?? []).map((s) => [s.size, s.quantity])
  );
  const sizeOrder = sizesForCategory(category);

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
        <select
          id="category"
          name="category"
          required
          defaultValue={initial?.category ?? "CLOTHING"}
          onChange={(event) => setCategory(event.target.value as Category)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_LABELS[cat]}
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
        <p className="form-field__hint">
          Quantity 0 → shows as &quot;Out of stock&quot; automatically.
          {sizeOrder.length > 0
            ? " Ignored if any size below is filled in — total stock is then the sum of sizes."
            : ""}
        </p>
      </div>

      {sizeOrder.length > 0 ? (
        <div className="form-field">
          <label>Sizes &amp; Stock (optional)</label>
          <p className="form-field__hint">
            Leave all sizes blank to manage this item with the single Quantity field above. Fill in
            any size to track stock per size instead — a customer will then have to pick a size
            before ordering.
          </p>
          <div className="product-form__sizes">
            {sizeOrder.map((size) => (
              <div className="product-form__size-row" key={size}>
                <label htmlFor={`size_${size}`}>{SIZE_LABELS[size]}</label>
                <input
                  type="number"
                  id={`size_${size}`}
                  name={`size_${size}`}
                  min="0"
                  step="1"
                  placeholder="—"
                  defaultValue={initialSizeQuantities.get(size) ?? ""}
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
