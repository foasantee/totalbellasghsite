export function StockBadge({ quantity }: { quantity: number }) {
  if (quantity <= 0) {
    return <span className="stock-badge stock-badge--out">Out of stock</span>;
  }
  if (quantity <= 3) {
    return <span className="stock-badge stock-badge--low">Only {quantity} left</span>;
  }
  return <span className="stock-badge stock-badge--in">In stock</span>;
}
