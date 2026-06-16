// Minimal product catalog used by backend functions (checkout, webhook, downloads).
// This intentionally duplicates a subset of frontend/src/data/products.json
// (id, price, currency, fullFile) because the backend is deployed
// independently to Netlify and should not depend on the frontend's build tree.
//
// IMPORTANT: when you add/edit a product in frontend/src/data/products.json,
// mirror the id / price / currency / fullFile fields here too.
// For a real production system, replace this with a shared database table
// (e.g. Supabase/Airtable) that both sides read from.
export const PRODUCTS = [
  { id: 'mindful-parenting-guide', price: 19, currency: 'USD', fullFile: 'mindful-parenting-full.pdf' },
  { id: 'creator-social-template-pack', price: 15, currency: 'USD', fullFile: 'template-pack-full.zip' },
  { id: 'ebook-business-blueprint', price: 25, currency: 'USD', fullFile: 'ebook-blueprint-full.pdf' },
];

export function findProduct(productId) {
  return PRODUCTS.find((p) => p.id === productId);
}
