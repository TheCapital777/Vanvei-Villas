export const APARTMENTS = [
  {
    slug: "pearl-suite",
    name: "The Pearl Suite",
    description:
      "A spacious one-bedroom apartment with a modern kitchen, living area, and private balcony overlooking the neighborhood.",
    price: 300000,
    beds: 1,
    guests: 2,
    gradient: "from-[#1a1a1a] to-[#2a2520]",
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Kitchen",
      "Balcony",
      "Smart TV",
      "Washer",
    ],
  },
  {
    slug: "coral-residence",
    name: "The Coral Residence",
    description:
      "Our two-bedroom apartment perfect for families or groups, featuring a full kitchen, dining area, and cozy lounge.",
    price: 450000,
    beds: 2,
    guests: 4,
    gradient: "from-[#2a2520] to-[#1a1a1a]",
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Full Kitchen",
      "Dining Area",
      "Smart TV",
      "Washer",
      "Workspace",
    ],
  },
  {
    slug: "gold-penthouse",
    name: "The Gold Penthouse",
    description:
      "The premium three-bedroom penthouse with panoramic views, luxury finishes, and a spacious open-plan living area.",
    price: 700000,
    beds: 3,
    guests: 6,
    gradient: "from-[#1a1a1a] to-[#2a2018]",
    amenities: [
      "Wi-Fi",
      "Air Conditioning",
      "Gourmet Kitchen",
      "Panoramic Views",
      "Smart TV",
      "Washer",
      "Workspace",
      "Premium Linens",
      "Espresso Machine",
    ],
  },
] as const;

export type ApartmentSlug = (typeof APARTMENTS)[number]["slug"];
