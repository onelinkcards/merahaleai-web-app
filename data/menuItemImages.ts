const FALLBACK =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80&auto=format&fit=crop";

const BY_NAME: Record<string, string> = {
  "Dal Baati Churma":
    "https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=100&q=80&auto=format&fit=crop",
  "Paneer Tikka":
    "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=100&q=80&auto=format&fit=crop",
  "Veg Biryani":
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&q=80&auto=format&fit=crop",
  "Chicken Biryani":
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100&q=80&auto=format&fit=crop",
  Samosa:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=100&q=80&auto=format&fit=crop",
  "Gulab Jamun":
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80&auto=format&fit=crop",
  Raita:
    "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&q=80&auto=format&fit=crop",
  "Butter Naan":
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&q=80&auto=format&fit=crop",
  Kheer:
    "https://images.unsplash.com/photo-1571167530149-c1105da4b1ac?w=100&q=80&auto=format&fit=crop",
  Chaat:
    "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=100&q=80&auto=format&fit=crop",
};

export function getMenuItemImageUrl(itemName: string): string {
  const direct = BY_NAME[itemName];
  if (direct) return direct;
  const lower = itemName.toLowerCase();
  for (const [k, v] of Object.entries(BY_NAME)) {
    if (lower.includes(k.toLowerCase()) || k.toLowerCase().includes(lower)) return v;
  }
  return FALLBACK;
}

export function shortMenuDescription(itemName: string): string {
  const m: Record<string, string> = {
    "Dal Tadka": "Tempered lentils, homestyle",
    "Paneer Butter Masala": "Creamy tomato gravy, paneer",
    "Paneer Tikka": "Chargrilled cottage cheese, spices",
    "Butter Naan": "Tandoor-baked flatbread",
    "Gulab Jamun": "Milk dumplings, rose syrup",
  };
  return m[itemName] ?? "Chef-crafted, fresh prep";
}
