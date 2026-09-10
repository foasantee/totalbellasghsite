import { BRANDS_DISCLAIMER, BRANDS_WE_CARRY } from "@/lib/site-config";

export function BrandGrid() {
  return (
    <>
      <div className="brand-grid">
        {BRANDS_WE_CARRY.map((brand) => (
          <div className="brand-card" key={brand}>
            <p className="brand-card__name">{brand}</p>
          </div>
        ))}
      </div>
      <p className="brands-disclaimer">{BRANDS_DISCLAIMER}</p>
    </>
  );
}
