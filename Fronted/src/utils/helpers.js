
// Helper utilities for SalesSavvy

export const formatINR = (amount) => {
  if (amount === undefined || amount === null) return "₹0.00";

  const num = Number(amount);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

// Product-specific images take priority over existing image data.
const productImages = [
  {
    keywords: ["wireless headphones", "headphones", "headphone"],
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    keywords: ["programming fundamentals", "programming book"],
    url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  },
  {
    keywords: ["travel backpack", "backpack"],
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  },
  {
    keywords: ["tubelight", "tube light", "led tube", "tube light bulb"],
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  },
];

// Fallback images for other products.
const fallbackCategoryImages = {
  electronics: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80",
  ],

  clothing: [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
    "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
  ],

  footwear: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
  ],

  home: [
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80",
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&q=80",
    "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
  ],

  books: [
    "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
  ],

  bags: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
  ],

  default: [
    "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
  ],
};

export const getProductImage = (
    imageInput,
    productName = "",
    id = 0
) => {
  const name = String(productName).trim().toLowerCase();

  // 1. Exact product-name mapping comes first.
  const matchingProduct = productImages.find((item) =>
      item.keywords.some((keyword) => name.includes(keyword))
  );

  if (matchingProduct) {
    return matchingProduct.url;
  }

  // 2. Use a valid existing image URL for other products.
  if (
      Array.isArray(imageInput) &&
      typeof imageInput[0] === "string" &&
      imageInput[0].startsWith("http")
  ) {
    return imageInput[0];
  }

  if (
      typeof imageInput === "string" &&
      imageInput.startsWith("http")
  ) {
    return imageInput;
  }

  // 3. Select a category fallback for unmatched products.
  let pool = fallbackCategoryImages.default;

  if (
      name.includes("headphone") ||
      name.includes("watch") ||
      name.includes("phone") ||
      name.includes("laptop") ||
      name.includes("earbud")
  ) {
    pool = fallbackCategoryImages.electronics;
  } else if (
      name.includes("programming") ||
      name.includes("book")
  ) {
    pool = fallbackCategoryImages.books;
  } else if (
      name.includes("backpack") ||
      name.includes("bag")
  ) {
    pool = fallbackCategoryImages.bags;
  } else if (
      name.includes("shirt") ||
      name.includes("dress") ||
      name.includes("pant") ||
      name.includes("jacket") ||
      name.includes("cloth")
  ) {
    pool = fallbackCategoryImages.clothing;
  } else if (
      name.includes("shoe") ||
      name.includes("sneaker") ||
      name.includes("boot")
  ) {
    pool = fallbackCategoryImages.footwear;
  } else if (
      name.includes("lamp") ||
      name.includes("chair") ||
      name.includes("decor") ||
      name.includes("tube light") ||
      name.includes("tubelight")
  ) {
    pool = fallbackCategoryImages.home;
  }

  const numericId = Number(id);
  const index =
      Math.abs(
          Number.isFinite(numericId) && numericId !== 0
              ? numericId
              : name.length
      ) % pool.length;

  return pool[index];
};
