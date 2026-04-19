export const PRODUCTS = [
  {
    id: 1,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 2,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/src/assets/laptop.png",
  },
  {
    id: 3,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/src/assets/headphones.png",
  },
  {
    id: 4,
    name: "Apple Watch Series 8",
    category: "Watches",
    price: "$399.00",
    image: "/src/assets/smartwatch.png",
  },
  {
    id: 5,
    name: "Samsung 65\" Class QLED 4K Smart TV",
    category: "TVs",
    price: "$1119.00",
    image: "/src/assets/tv-screen.png",
  },
  {
    id: 6,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/src/assets/LJB speaker.png",
  },
  {
    id: 7,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/src/assets/headphones.png",
  },
  {
    id: 8,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 9,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/src/assets/LJB speaker.png",
  },
  {
    id: 10,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/src/assets/headphones.png",
  },
  {
    id: 11,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 12,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/src/assets/LJB speaker.png",
  },
  {
    id: 13,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/src/assets/headphones.png",
  },
  {
    id: 14,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 15,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 16,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/src/assets/laptop.png",
  },
  {
    id: 17,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/src/assets/headphones.png",
  },
  {
    id: 18,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/src/assets/mouse.png",
  },
  {
    id: 19,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/src/assets/laptop.png",
  },
  {
    id: 20,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/src/assets/headphones.png",
  },
  {
    id: 21,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/src/assets/laptop.png",
  },
  {
    id: 22,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/src/assets/headphones.png",
  },
];

export const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

export const BENTO_CATEGORIES = [
  {
    id: 1,
    title: "EarBuds",
    filterCategory: "Headphones",
    subtitle: "Enjoy",
    subtitle2: "With",
    color: "bg-[#1a1a1a]",
    textColor: "text-white",
    image: "/src/assets/headphones.png",
    colSpan: "col-span-1"
  },
  {
    id: 2,
    title: "GADGET",
    filterCategory: "Watches",
    subtitle: "Wearable",
    subtitle2: "Series",
    color: "bg-m-yellow",
    textColor: "text-white",
    image: "/src/assets/smartwatch.png",
    colSpan: "col-span-1"
  },
  {
    id: 3,
    title: "LAPTOP",
    filterCategory: "PCs",
    subtitle: "Premium",
    subtitle2: "Apple",
    color: "bg-m-red",
    textColor: "text-white",
    image: "/src/assets/laptop.png",
    colSpan: "col-span-1 sm:col-span-2"
  },
  {
    id: 4,
    title: "CONSOLE",
    filterCategory: "Mouses",
    subtitle: "Play",
    subtitle2: "Next Gen",
    color: "bg-[#ebebeb]",
    textColor: "text-[#1a1a1a]",
    image: "/src/assets/laptop.png",
    colSpan: "col-span-1 sm:col-span-2"
  },
  {
    id: 5,
    title: "VIRTUAL",
    filterCategory: "TVs",
    subtitle: "Explore",
    subtitle2: "Reality",
    color: "bg-m-green",
    textColor: "text-white",
    image: "/src/assets/tv-screen.png",
    colSpan: "col-span-1"
  },
  {
    id: 6,
    title: "SPEAKER",
    filterCategory: "Speaker",
    subtitle: "Bass",
    subtitle2: "Heavy",
    color: "bg-m-blue",
    textColor: "text-white",
    image: "/src/assets/LJB speaker.png",
    colSpan: "col-span-1"
  }
];

export const FAQS = [
  {
    id: 1,
    question: "What is your return policy?",
    answer: "We offer a 30-day money-back guarantee on all our products. Return items in their original condition for a full refund."
  },
  {
    id: 2,
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within Morocco to ensure fast and reliable delivery."
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 2-4 business days. Express shipping is available for next-day delivery in select cities."
  },
  {
    id: 4,
    question: "Is there a warranty on your products?",
    answer: "Yes, all products come with a minimum 1-year manufacturer warranty covering technical defects."
  }
];
