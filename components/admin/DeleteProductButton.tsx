"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "@/actions/products";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      className="btn btn-secondary"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Delete this product? This can't be undone.")) return;
        startTransition(async () => {
          await deleteProduct(productId);
          router.push("/admin/products");
        });
      }}
    >
      {pending ? "Deleting…" : "Delete Product"}
    </button>
  );
}
