import { getVendorDetailBySlug } from "@/data/vendors";

export function getDefaultMenuKeys(slug: string, packageId: string): string[] {
  const v = getVendorDetailBySlug(slug);
  if (!v) return [];
  const pkg = v.packages.find((p) => p.id === packageId);
  if (!pkg) return [];
  const keys: string[] = [];
  for (const cat of pkg.categories) {
    for (const item of cat.items) {
      if (item.isDefault) keys.push(cat.name + "::" + item.name);
    }
  }
  return keys;
}

export type GroupedMenu = { category: string; items: { key: string; name: string; isVeg: boolean; isAddOn: boolean }[] }[];

export function groupMenuItemsForReview(
  slug: string,
  packageId: string,
  selectedKeys: string[],
  _addOnRateVeg: number,
  _addOnRateNonVeg: number
): GroupedMenu {
  const v = getVendorDetailBySlug(slug);
  if (!v) return [];
  const pkg = v.packages.find((p) => p.id === packageId);
  if (!pkg) return [];

  const defaultKeys = new Set(getDefaultMenuKeys(slug, packageId));
  const keySet = new Set(selectedKeys);
  const byCat = new Map<string, { key: string; name: string; isVeg: boolean; isAddOn: boolean }[]>();

  for (const cat of pkg.categories) {
    for (const item of cat.items) {
      const key = cat.name + "::" + item.name;
      if (!keySet.has(key)) continue;
      const isAddOn = !defaultKeys.has(key);
      const list = byCat.get(cat.name) ?? [];
      list.push({ key, name: item.name, isVeg: item.isVeg, isAddOn });
      byCat.set(cat.name, list);
    }
  }

  return Array.from(byCat.entries()).map(([category, items]) => ({ category, items }));
}
