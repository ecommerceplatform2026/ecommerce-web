export interface Product {
  id: string
  name: string
  category: string
  price: number
  description: string
  images: string[]
  sizes: string[]
  colors: string[]
  featured?: boolean
  stock: number
}

export const products: Product[] = [
  {
    id: "1",
    name: "Cashmere Overcoat",
    category: "Outerwear",
    price: 1850,
    description:
      "Luxurious Italian cashmere overcoat with a timeless silhouette. Features peak lapels, double-breasted closure, and interior pockets. Perfect for elevating any formal ensemble.",
    images: ["/luxury-black-cashmere-overcoat-on-model.jpg", "/black-cashmere-coat-detail-texture.jpg"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Navy", "Camel"],
    featured: true,
    stock: 12,
  },
  {
    id: "2",
    name: "Merino Wool Sweater",
    category: "Knitwear",
    price: 425,
    description:
      "Premium merino wool crewneck sweater with ribbed detailing. Lightweight yet warm, perfect for layering or wearing alone. Crafted in Scotland.",
    images: ["/luxury-grey-merino-wool-sweater.jpg", "/merino-wool-knit-texture-detail.jpg"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Grey", "Navy", "Burgundy", "Forest Green"],
    featured: true,
    stock: 8,
  },
  {
    id: "3",
    name: "Tailored Wool Trousers",
    category: "Trousers",
    price: 595,
    description:
      "Impeccably tailored wool trousers with a modern slim fit. Features Italian wool fabric, side adjusters, and hand-finished details throughout.",
    images: ["/luxury-charcoal-wool-trousers.jpg", "/tailored-trousers-detail.png"],
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: ["Charcoal", "Navy", "Grey"],
    featured: true,
    stock: 15,
  },
  {
    id: "4",
    name: "Oxford Dress Shirt",
    category: "Shirts",
    price: 285,
    description:
      "Classic oxford dress shirt in premium Egyptian cotton. Features mother-of-pearl buttons, split yoke, and a refined collar. Made in Italy.",
    images: ["/white-oxford-dress-shirt-luxury.jpg", "/dress-shirt-collar.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink"],
    featured: false,
    stock: 20,
  },
  {
    id: "5",
    name: "Leather Chelsea Boots",
    category: "Footwear",
    price: 725,
    description:
      "Handcrafted Chelsea boots in premium Italian leather. Features Goodyear welt construction, leather sole, and elastic side panels. Built to last a lifetime.",
    images: ["/luxury-black-leather-chelsea-boots.jpg", "/chelsea-boots-leather-detail.jpg"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "Brown", "Tan"],
    featured: true,
    stock: 10,
  },
  {
    id: "6",
    name: "Silk Pocket Square",
    category: "Accessories",
    price: 95,
    description:
      "Hand-rolled silk pocket square with timeless pattern. Made in Como, Italy from the finest silk. Adds a refined finishing touch to any jacket.",
    images: ["/luxury-silk-pocket-square-navy.jpg", "/silk-pocket-square-folded.jpg"],
    sizes: ["One Size"],
    colors: ["Navy", "Burgundy", "Forest Green", "Charcoal"],
    featured: false,
    stock: 25,
  },
  {
    id: "7",
    name: "Leather Briefcase",
    category: "Accessories",
    price: 1250,
    description:
      "Full-grain leather briefcase with brass hardware. Features multiple compartments, padded laptop sleeve, and adjustable shoulder strap. Handmade in Florence.",
    images: ["/luxury-brown-leather-briefcase.jpg", "/leather-briefcase-interior-detail.jpg"],
    sizes: ["One Size"],
    colors: ["Cognac", "Black", "Dark Brown"],
    featured: true,
    stock: 7,
  },
  {
    id: "8",
    name: "Cashmere Scarf",
    category: "Accessories",
    price: 385,
    description:
      "Luxuriously soft cashmere scarf from Scotland. Lightweight yet incredibly warm, with hand-finished edges. An essential cold-weather accessory.",
    images: ["/luxury-grey-cashmere-scarf.jpg", "/cashmere-scarf-texture-detail.jpg"],
    sizes: ["One Size"],
    colors: ["Grey", "Navy", "Camel", "Charcoal"],
    featured: false,
    stock: 18,
  },
  {
    id: "9",
    name: "Suede Bomber Jacket",
    category: "Outerwear",
    price: 1450,
    description:
      "Contemporary suede bomber jacket with ribbed collar and cuffs. Features Italian suede, interior pockets, and a relaxed fit. Perfect for smart-casual occasions.",
    images: ["/luxury-navy-suede-bomber-jacket.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Olive", "Tan"],
    featured: true,
    stock: 9,
  },
  {
    id: "10",
    name: "Premium Wool Vest",
    category: "Knitwear",
    price: 325,
    description:
      "Sophisticated wool blend vest with V-neckline. Perfect layering piece for any formal or business casual outfit.",
    images: ["/wool-vest.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Navy", "Grey"],
    featured: true,
    stock: 14,
  },
  {
    id: "11",
    name: "Italian Leather Loafers",
    category: "Footwear",
    price: 595,
    description:
      "Timeless leather loafers crafted from premium Italian leather. Comfortable yet sophisticated for any occasion.",
    images: ["/leather-loafers.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "Brown"],
    featured: false,
    stock: 16,
  },
  {
    id: "12",
    name: "Wool Turtleneck",
    category: "Knitwear",
    price: 385,
    description: "Classic wool turtleneck sweater in premium quality. Warm and elegant for layering or wearing solo.",
    images: ["/turtleneck.png", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Grey"],
    featured: true,
    stock: 11,
  },
  {
    id: "13",
    name: "Linen Dress Shirt",
    category: "Shirts",
    price: 245,
    description: "Summer staple linen dress shirt with breathable fabric. Perfect for warm weather elegance.",
    images: ["/linen-shirt.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Beige", "Light Blue"],
    featured: false,
    stock: 22,
  },
  {
    id: "14",
    name: "Wool Overcoat Navy",
    category: "Outerwear",
    price: 1650,
    description:
      "Classic navy wool overcoat with elegant tailoring. A wardrobe essential for the discerning gentleman.",
    images: ["/navy-coat.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy"],
    featured: true,
    stock: 9,
  },
  {
    id: "15",
    name: "Silk Tie Collection",
    category: "Accessories",
    price: 125,
    description: "Fine silk ties in various patterns. Add the perfect finishing touch to any formal ensemble.",
    images: ["/silk-tie.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["One Size"],
    colors: ["Navy", "Burgundy", "Grey", "Black"],
    featured: false,
    stock: 30,
  },
  {
    id: "16",
    name: "Leather Oxford Shoes",
    category: "Footwear",
    price: 675,
    description: "Formal leather Oxford shoes handcrafted in Italy. The perfect complement to formal attire.",
    images: ["/oxford-shoes.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["Black", "Tan"],
    featured: true,
    stock: 13,
  },
  {
    id: "17",
    name: "Cotton Polo Shirt",
    category: "Shirts",
    price: 185,
    description: "Premium cotton polo shirt for smart-casual occasions. Comfortable and versatile.",
    images: ["/polo-shirt.jpg", "/placeholder.svg?height=800&width=600"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Light Blue", "Grey"],
    featured: false,
    stock: 25,
  },
]

export function getFeaturedProducts() {
  return products.filter((p) => p.featured)
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string) {
  return products.filter((p) => p.category === category)
}

export function getCategories() {
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category)))

  const categoryMap: Record<string, { name: string; image: string; href: string }> = {
    Outerwear: { name: "Outerwear", image: "/luxury-coat.jpg", href: "/shop?category=Outerwear" },
    Knitwear: { name: "Knitwear", image: "/soft-cashmere-sweater.png", href: "/shop?category=Knitwear" },
    Trousers: { name: "Trousers", image: "/tailored-suit.jpg", href: "/shop?category=Trousers" },
    Shirts: { name: "Shirts", image: "/white-oxford-dress-shirt-luxury.jpg", href: "/shop?category=Shirts" },
    Footwear: { name: "Footwear", image: "/luxury-black-leather-chelsea-boots.jpg", href: "/shop?category=Footwear" },
    Accessories: { name: "Accessories", image: "/leather-accessories.jpg", href: "/shop?category=Accessories" },
  }

  return uniqueCategories.map(
    (category) =>
      categoryMap[category] || {
        name: category,
        image: "/placeholder.svg?height=800&width=600",
        href: `/shop?category=${category}`,
      },
  )
}

export function getHotProducts() {
  return products.filter((p) => p.stock > 10).slice(0, 4)
}

export function getBestSellingProducts() {
  return products.filter((p) => p.featured).slice(0, 4)
}

export function getPromotionalProducts() {
  return products.filter((p) => p.stock < 10).slice(0, 4)
}
