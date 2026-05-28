/**
 * Utility functions for product variants parsing and grouping.
 */

export interface VariantData {
  sku: string;
  attributes: Record<string, any>;
  is_default: boolean;
  product_variant_id: number;
  image_urls?: string[];
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  sku: string;
  variant_label: string;
  attributes: Record<string, any>;
  price: number;
  stock_quantity: number;
  is_default: boolean;
  image_urls?: string[];
}

export interface ProductOption {
  id: number;
  name: string; // Original full product name
  specValue: string; // Extracted specification value (e.g., "3M", "512GB", "Noir")
  price: string;
  oldPrice?: string;
  quantity: number;
  image: string;
  images: string[];
  variantData?: VariantData;
}

export interface Product {
  id: number;
  name: string; // Base name (cleaned)
  slug?: string; // URL-friendly slug
  category: string;
  price: string; // Lowest price among options
  oldPrice?: string;
  image: string;
  images: string[];
  colors?: string[];
  specs?: Record<string, string>;
  description?: string;
  badge?: string;
  quantity?: number;
  options?: ProductOption[];
}

/**
 * Extracts specifications (length, capacity, size, color, model) from product name
 * and returns the cleaned base name along with the extracted specification string.
 */
export function cleanAndExtractSpec(originalName: string | null | undefined): {
  baseName: string;
  specValue: string;
} {
  if (!originalName || typeof originalName !== "string") {
    return { baseName: "Unnamed Product", specValue: "" };
  }

  let name = originalName.trim();
  const matchedSpecs: string[] = [];

  // A. Length: e.g., "3M", "5M", "10M", "1.5M", "1.5m", "10 metre", "5 metres"
  const lengthRegex =
    /\b(\d+(?:\.\d+)?\s*(?:[mM]\b|metre|metres|meters|Meters))\b/i;

  // B. Capacity/Storage: e.g., "512GB", "240GB", "256Gb", "1TB", "16GB", "70ML", "135ML", "70ml", "135ml"
  const capacityRegex =
    /\b(\d+\s*(?:GB|Gb|gb|TB|Tb|tb|ML|Ml|ml|pouce|pouces|inch|inches|"))\b/i;

  // C. Resolution/Camera specifications: e.g., "2MP/20M", "5MP/30M", "5MP/20M", "10MP", "3Mp", "2MP", "5MP"
  const resolutionRegex = /\b(\d+\s*[mM][pP](?:\/\d+[mM])?)\b/i;

  // D. Specific Model suffixes if they represent variant configurations: E400, E700, E800, etc.
  const modelRegex = /\b([eE]\d{3})\b/i;

  // E. Colors: Noir, Bleu, Jaune, Rouge, Vert, Blanc, Black, Blue, Yellow, Red, Green, White, etc.
  const colorRegex =
    /\b(Noir|Bleu|Jaune|Rouge|Vert|Blanc|Black|Blue|Yellow|Red|Green|White|Couleur)\b/i;

  // Track if we made changes
  let loop = true;
  let iterations = 0; // Prevent infinite loop

  while (loop && iterations < 5) {
    loop = false;
    iterations++;

    // Check Length
    const lenMatch = name.match(lengthRegex);
    if (lenMatch) {
      matchedSpecs.push(lenMatch[1]);
      name = name.replace(lenMatch[0], "");
      loop = true;
    }

    // Check Capacity
    const capMatch = name.match(capacityRegex);
    if (capMatch) {
      matchedSpecs.push(capMatch[1]);
      name = name.replace(capMatch[0], "");
      loop = true;
    }

    // Check Resolution
    const resMatch = name.match(resolutionRegex);
    if (resMatch) {
      matchedSpecs.push(resMatch[1]);
      name = name.replace(resMatch[0], "");
      loop = true;
    }

    // Check Model
    const modMatch = name.match(modelRegex);
    if (modMatch) {
      matchedSpecs.push(modMatch[1]);
      name = name.replace(modMatch[0], "");
      loop = true;
    }

    // Check Color
    const colMatch = name.match(colorRegex);
    if (colMatch) {
      matchedSpecs.push(colMatch[1]);
      name = name.replace(colMatch[0], "");
      loop = true;
    }
  }

  // General cleanup of baseName
  let baseName = name
    .replace(/\s+/g, " ")
    .replace(/[-–—/()]+$/, "") // remove trailing symbols
    .replace(/^[-–—/()]+/, "") // remove leading symbols
    .trim();

  // If after stripping everything the base name is too short or empty, fallback
  if (baseName.length < 3) {
    baseName = originalName.trim();
    return { baseName, specValue: "" };
  }

  // Capitalize baseName nicely
  baseName = baseName.replace(/\b\w/g, (c) => c.toUpperCase());

  // Join matched specs nicely
  const specValue = matchedSpecs.join(" ").trim();

  return { baseName, specValue };
}

/**
 * Parses numeric price from formatted price string (e.g. "$60.00" -> 60.00)
 */
export function getPriceNumber(priceStr: any): number {
  if (typeof priceStr === "number") {
    return priceStr;
  }
  if (!priceStr || typeof priceStr !== "string") {
    return 0;
  }
  return parseFloat(priceStr.replace(/[^\d.]/g, "")) || 0;
}

/**
 * Groups raw products into combined products with options/variants
 */
export function groupProductsByVariants(rawProducts: any[]): Product[] {
  if (!Array.isArray(rawProducts)) {
    return [];
  }

  const groups: Record<string, any[]> = {};

  rawProducts.forEach((product) => {
    if (!product) return;
    const productName = product.name || "Unnamed Product";
    const productCategory = product.category || "Uncategorized";

    const { baseName, specValue } = cleanAndExtractSpec(productName);
    // Group by category and baseName to keep brand/category integrity
    const categoryKey = productCategory.toLowerCase();
    const nameKey = baseName.toLowerCase();
    const groupKey = `${categoryKey}::${nameKey}`;

    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }

    groups[groupKey].push({
      ...product,
      category: productCategory,
      baseName,
      specValue,
    });
  });

  const groupedProducts: Product[] = [];

  Object.entries(groups).forEach(([_, items]) => {
    if (items.length === 0) return;

    // Sort items by price ascending so the cheapest becomes default
    items.sort((a, b) => getPriceNumber(a.price) - getPriceNumber(b.price));

    const cheapestItem = items[0];
    const baseProduct: Product = {
      id: cheapestItem.id,
      name: cheapestItem.baseName,
      category: cheapestItem.category,
      price: cheapestItem.price || "$0.00",
      oldPrice: cheapestItem.oldPrice,
      image: cheapestItem.image || "/assets/placeholder.png",
      images: Array.isArray(cheapestItem.images)
        ? cheapestItem.images
        : cheapestItem.image
          ? [cheapestItem.image]
          : ["/assets/placeholder.png"],
      colors: cheapestItem.colors || ["#1a1a1a", "#ffffff"],
      description: cheapestItem.description,
      badge: cheapestItem.badge,
      quantity:
        typeof cheapestItem.quantity === "number" ? cheapestItem.quantity : 0,
    };

    // If there is only one item in the group, and it has no specValue, it has no options
    if (items.length === 1 && !cheapestItem.specValue) {
      groupedProducts.push(baseProduct);
    } else {
      // If there are multiple items, or a single item with a specValue, it has options
      const options: ProductOption[] = items.map((item) => ({
        id: item.id,
        name: item.name || "Unnamed Option",
        specValue: item.specValue || "Default",
        price: item.price || "$0.00",
        oldPrice: item.oldPrice,
        quantity: typeof item.quantity === "number" ? item.quantity : 0,
        image: item.image || "/assets/placeholder.png",
        images: Array.isArray(item.images)
          ? item.images
          : item.image
            ? [item.image]
            : ["/assets/placeholder.png"],
      }));

      // Update base product with options list and details of the cheapest
      baseProduct.options = options;

      // Let's also build a nice description listing options or specifications
      if (options.length > 1) {
        const specList = options.map((o) => o.specValue).join(", ");
        baseProduct.description = `${cheapestItem.description || `High quality ${cheapestItem.category}`}. Available options: ${specList}.`;
      }

      groupedProducts.push(baseProduct);
    }
  });

  // Sort final products by ID or keep order
  return groupedProducts.sort((a, b) => a.id - b.id);
}
