export const PRODUCTS = [
  {
    id: 1,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png", "/assets/mouse.png", "/assets/mouse.png"],
    colors: ["#1a1a1a", "#ffffff", "#f1c40f"],
    specs: {
      "Weight": "80g",
      "Sensor": "HERO 25K",
      "Resolution": "100 – 25,600 DPI",
      "Max. acceleration": "> 40 G",
      "Max. speed": "> 400 IPS",
      "Battery Life": "70 hours"
    },
    description: "The Logitech G Pro Wireless was designed to be the ultimate gaming mouse for esports professionals. Over a 2 year period, Logitech G collaborated with more than 50 professional players to find the perfect shape, weight and feel combined with our LIGHTSPEED wireless and HERO 25k sensor technologies."
  },
  {
    id: 2,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/assets/laptop.png",
    images: ["/assets/laptop.png", "/assets/laptop.png"],
    colors: ["#1a1a1a", "#ffffff"],
    specs: {
      "CPU": "Intel Core i9-13900K",
      "GPU": "NVIDIA GeForce RTX 4090",
      "RAM": "64GB DDR5",
      "Storage": "2TB NVMe SSD",
      "PSU": "1000W 80+ Gold",
      "Cooling": "360mm AIO Liquid Cooler"
    },
    description: "Push the boundaries of performance with our flagship Custom Gaming PC. Built with the latest hardware from Intel and NVIDIA, this beast is designed to handle 4K gaming, 3D rendering, and heavy multitasking without breaking a sweat."
  },
  {
    id: 3,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png", "/assets/headphones.png", "/assets/headphones.png", "/assets/headphones.png"],
    colors: ["#1a1a1a", "#dfd3c3", "#2c3e50"],
    specs: {
      "Driver Unit": "40mm, dome type",
      "Frequency Response": "4Hz-40,000Hz",
      "Bluetooth": "Version 5.0",
      "Battery Charge Time": "Approx. 3 Hours",
      "Battery Life": "Max. 30 hours",
      "Noise Cancelling": "Industry-leading Dual Noise Sensor"
    },
    description: "Sony's intelligent industry-leading noise canceling headphones with premium sound elevate your listening experience with the ability to personalize and control everything you hear."
  },
  {
    id: 4,
    name: "Apple Watch Series 8",
    category: "Watches",
    price: "$399.00",
    image: "/assets/smartwatch.png",
    images: ["/assets/smartwatch.png", "/assets/smartwatch.png"],
    colors: ["#1a1a1a", "#ffffff", "#c1272d"],
    specs: {
      "Case Size": "41mm or 45mm",
      "Display": "Always-On Retina display",
      "Water Resistance": "WR50",
      "Sensors": "Blood Oxygen, ECG, Temperature",
      "Connectivity": "LTE and UMTS",
      "Chip": "S8 SiP"
    },
    description: "Apple Watch Series 8 features advanced health sensors and apps, so you can take an ECG, measure heart rate and blood oxygen, and track temperature changes for advanced insights into your menstrual cycle."
  },
  {
    id: 5,
    name: "Samsung 65\" Class QLED 4K Smart TV",
    category: "TVs",
    price: "$1119.00",
    image: "/assets/tv-screen.png",
    images: ["/assets/tv-screen.png"],
    specs: {
      "Screen Size": "65\"",
      "Resolution": "3,840 x 2,160",
      "Refresh Rate": "120Hz",
      "HDR": "Quantum HDR",
      "Processor": "Quantum Processor 4K",
      "Voice Assistant": "Bixby, Alexa, Google Assistant"
    },
    description: "A billion shades of color with Quantum Dot. Step into a world of saturated color with Quantum HDR 4K. Experience deep blacks, bright highlights and detailed picture."
  },
  {
    id: 6,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/assets/lgb-speaker.png",
    images: ["/assets/lgb-speaker.png", "/assets/lgb-speaker.png"],
    colors: ["#1a1a1a", "#c1272d", "#006233", "#007bff"],
    specs: {
      "Output Power": "20W RMS for woofer",
      "Battery Type": "Li-ion polymer 17.28Wh",
      "Battery Charge Time": "2.5 hours",
      "Music Play Time": "Up to 12 hours",
      "Bluetooth": "Version 5.1",
      "Waterproof": "IP67"
    },
    description: "Louder, more powerful sound. The beat goes on with the JBL Flip 6 2-way speaker system, engineered to deliver loud, crystal clear, powerful sound. Ready for any weather with IP67 waterproof and dustproof design."
  },
  {
    id: 7,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
    specs: {
      "Resolution": "1832 x 1920 per eye",
      "Refresh Rate": "90Hz",
      "Storage": "128GB / 256GB",
      "Audio": "Built-in positional audio",
      "Tracking": "Inside-out tracking",
      "Chip": "Qualcomm Snapdragon XR2"
    },
    description: "Meta Quest 2 is our most advanced all-in-one VR system yet. Every detail has been engineered to make virtual worlds adapt to your movements, letting you explore awe-inspiring games and experiences with unparalleled freedom."
  },
  {
    id: 8,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png"],
    colors: ["#1a1a1a"],
    specs: {
      "Sensor": "Focus+ 20K DPI Optical Sensor",
      "Switches": "Mechanical Mouse Switches",
      "Lighting": "Razer Chroma RGB",
      "Weight": "82g",
      "Programmable Buttons": "8",
      "Cable": "Razer Speedflex Cable"
    },
    description: "With over 10 million Razer DeathAdders sold, the most celebrated and awarded gaming mouse in the world has earned its popularity through its exceptional ergonomic design."
  },
  {
    id: 9,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/assets/lgb-speaker.png",
    images: ["/assets/lgb-speaker.png"],
  },
  {
    id: 10,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
  },
  {
    id: 11,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png"],
  },
  {
    id: 12,
    name: "JBL Flip 6 Portable Speaker",
    category: "Speaker",
    price: "$129.00",
    image: "/assets/lgb-speaker.png",
    images: ["/assets/lgb-speaker.png"],
  },
  {
    id: 13,
    name: "Meta Quest 2",
    category: "VR Headset",
    price: "$299.00",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
  },
  {
    id: 14,
    name: "Razer DeathAdder V2",
    category: "Mouses",
    price: "$69.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png"],
  },
  {
    id: 15,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png"],
  },
  {
    id: 16,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/assets/laptop.png",
    images: ["/assets/laptop.png"],
  },
  {
    id: 17,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
  },
  {
    id: 18,
    name: "Logitech G Pro Wireless",
    category: "Mouses",
    price: "$129.00",
    oldPrice: "$149.00",
    image: "/assets/mouse.png",
    images: ["/assets/mouse.png"],
  },
  {
    id: 19,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/assets/laptop.png",
    images: ["/assets/laptop.png"],
  },
  {
    id: 20,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
  },
  {
    id: 21,
    name: "Custom Gaming PC",
    category: "PCs",
    price: "$1409.00",
    image: "/assets/laptop.png",
    images: ["/assets/laptop.png"],
  },
  {
    id: 22,
    name: "Sony WH-1000XM4 Noise Cancelling",
    category: "Headphones",
    price: "$348.00",
    oldPrice: "$399.00",
    badge: "Sale",
    image: "/assets/headphones.png",
    images: ["/assets/headphones.png"],
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
    image: "/assets/headphones.png",
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
    image: "/assets/smartwatch.png",
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
    image: "/assets/laptop.png",
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
    image: "/assets/laptop.png",
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
    image: "/assets/tv-screen.png",
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
    image: "/assets/lgb-speaker.png",
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
