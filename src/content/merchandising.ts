interface MerchandisablePackage {
  category?: string;
  displayOrder: number;
  featured?: boolean;
  name: string;
}

export function comparePackageMerchandising(
  left: MerchandisablePackage,
  right: MerchandisablePackage,
) {
  return (
    left.displayOrder - right.displayOrder ||
    left.name.localeCompare(right.name, "en")
  );
}

export function selectHomepagePackages<T extends MerchandisablePackage>(
  packages: readonly T[],
): T[] {
  return packages
    .filter((pkg) => pkg.featured && pkg.category === "Sound")
    .toSorted(comparePackageMerchandising)
    .slice(0, 3);
}
