const fs = require('fs');
let text = fs.readFileSync('src/data.ts', 'utf8');
const match = text.match(/export const PRODUCTS = \[([\s\S]*?)\];/);
if (!match) throw new Error("not found");
const originalProducts = [
  { id: 1, name: "Logitech G Pro Wireless", category: "Mouses", price: "$129.00", oldPrice: "$149.00", image: "/src/assets/mouse.png" },
  { id: 2, name: "Custom Gaming PC", category: "PCs", price: "$1409.00", image: "/src/assets/laptop.png" },
  { id: 3, name: "Sony WH-1000XM4 Noise Cancelling", category: "Headphones", price: "$348.00", oldPrice: "$399.00", badge: "Sale", image: "/src/assets/headphones.png" },
  { id: 4, name: "Apple Watch Series 8", category: "Watches", price: "$399.00", image: "/src/assets/smartwatch.png" },
  { id: 5, name: "Samsung 65\" Class QLED 4K Smart TV", category: "TVs", price: "$1119.00", image: "/src/assets/tv-screen.png" },
  { id: 6, name: "JBL Flip 6 Portable Speaker", category: "Speaker", price: "$129.00", image: "/src/assets/LJB speaker.png" },
  { id: 7, name: "Meta Quest 2", category: "VR Headset", price: "$299.00", image: "/src/assets/headphones.png" },
  { id: 8, name: "Razer DeathAdder V2", category: "Mouses", price: "$69.00", image: "/src/assets/mouse.png" }
];
let newProducts = [];
for (let i = 0; i < 120; i++) {
  let p = Object.assign({}, originalProducts[i % originalProducts.length]);
  p.id = i + 1;
  if (i >= 8) {
    p.name = `${p.name} v${Math.floor(i/8) + 1}`;
  }
  newProducts.push(p);
}
let newText = text.replace(/export const PRODUCTS = \[([\s\S]*?)\];/, 'export const PRODUCTS = ' + JSON.stringify(newProducts, null, 2).replace(/"([^"]+)":/g, '$1:') + ';');
fs.writeFileSync('src/data.ts', newText);
