export type StoreProduct = {
  id: string;
  name: string;
  price: number;
  compareAt: number;
  rating: number;
  reviews: number;
  cardImage: string;
  detailImages: string[];
  description: string;
  longDescription: string[];
  benefits: string[];
};

export const storeProducts: StoreProduct[] = [
  {
    id: "amethyst-balance",
    name: "Amethyst Balance Bracelet",
    price: 35,
    compareAt: 42,
    rating: 5,
    reviews: 128,
    cardImage: "/figma/store/product-amethyst.png",
    detailImages: [
      "/figma/store/product-amethyst.png",
      "/assets/crystal-flow/amethyst-detail.jpg",
    ],
    description:
      "A handcrafted amethyst bracelet with a quieter, more balanced silhouette for everyday wear.",
    longDescription: [
      "Amethyst is often chosen for calm, balance, and a softer evening routine, which makes it the most giftable piece in the set.",
      "Each bead is hand-strung on durable elastic cord so the profile stays clean and comfortable throughout the day.",
    ],
    benefits: [
      "Promotes calm and restful sleep",
      "Enhances spiritual awareness",
      "Helps with emotional balance",
    ],
  },
  {
    id: "rose-quartz-love",
    name: "Rose Quartz Love Bracelet",
    price: 32,
    compareAt: 40,
    rating: 5,
    reviews: 95,
    cardImage: "/figma/store/product-rose.png",
    detailImages: [
      "/figma/store/product-rose.png",
      "/assets/crystal-flow/rose-detail.jpg",
    ],
    description:
      "A warmer rose quartz bracelet designed for gifting, self-love, and softer daily styling.",
    longDescription: [
      "This variant leans into warmth and emotional softness without becoming overly decorative.",
      "The polished stones and balanced spacing keep the piece gentle, wearable, and easy to pair with daily outfits.",
    ],
    benefits: [
      "Opens heart to love",
      "Promotes self-compassion",
      "Supports emotional healing",
    ],
  },
  {
    id: "clear-quartz-clarity",
    name: "Clear Quartz Clarity Bracelet",
    price: 38,
    compareAt: 45,
    rating: 5,
    reviews: 87,
    cardImage: "/figma/store/product-clear.png",
    detailImages: [
      "/figma/store/product-clear.png",
      "/assets/crystal-flow/clear-detail.jpg",
    ],
    description:
      "The cleanest bracelet in the collection, built around clarity, focus, and a lighter visual profile.",
    longDescription: [
      "This is the most editorial piece in the set and works naturally with calmer wardrobes and minimal styling.",
      "Its transparent character makes the material finish matter more than color, which gives it a cleaner premium feel.",
    ],
    benefits: [
      "Amplifies intentions",
      "Enhances clarity",
      "Master healing stone",
    ],
  },
];

export const storeFaqs = [
  {
    question: "How do I choose my crystal?",
    answer:
      "Choose by mood and occasion. Amethyst feels calm and grounding, Rose Quartz is softer and more giftable, and Clear Quartz is the cleanest option for an everyday routine.",
  },
  {
    question: "What's your shipping policy?",
    answer:
      "Orders over $50 ship free. Standard US delivery takes 3-5 business days, and international delivery usually arrives within 7-14 business days.",
  },
  {
    question: "Do you offer returns?",
    answer:
      "Yes. We offer a 30-day return window for items kept in original condition.",
  },
];

export const storyParagraphs = [
  "Each bracelet is built around material, rhythm, and daily wearability. The goal is not excess symbolism, but a calmer object people genuinely want to keep close.",
  "We work with small-batch materials, gift-ready packaging, and a tone that feels quieter than most wellness brands in the market.",
  "Crystal Flow is designed to sit between jewelry and ritual: polished enough to gift, simple enough to wear every day.",
];

export const previewPromptSuggestions = [
  "Make the hero feel calmer",
  "Lean more into gifting",
  "Push the tone toward premium wellness",
  "Strengthen the main CTA",
];
